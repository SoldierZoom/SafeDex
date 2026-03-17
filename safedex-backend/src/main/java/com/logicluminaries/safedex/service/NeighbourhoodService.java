package com.logicluminaries.safedex.service;

import com.logicluminaries.safedex.model.CrimeRecord;
import com.logicluminaries.safedex.model.Neighbourhood;
import com.logicluminaries.safedex.repository.NeighbourhoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NeighbourhoodService {
    private final NeighbourhoodRepository neighbourhoodRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private static final int ITEMS_PER_PAGE = 20;

    //helper functions for addNeighbourhood
    //all API call stuff
    private Neighbourhood getCrimeData(Neighbourhood neighbourhood) throws InterruptedException {
        double lat = neighbourhood.getLatitude();
        double lng = neighbourhood.getLongitude();

        //finding id neighbourhood in crime api to get neighbourhood boundary and population
        String locateUrl = String.format(
                "https://data.police.uk/api/locate-neighbourhood?q=%f,%f",
                lat, lng
        );
        Map<String, String> locateResp = restTemplate.getForObject(locateUrl, Map.class);
        String neighbourhoodId = locateResp.get("neighbourhood");
        String force = locateResp.get("force");//e.g. west midlands
        Thread.sleep(500);// so no rate limits

        //used to get population of neighbourhood
        String detailsUrl = String.format(
                "https://data.police.uk/api/%s/%s",
                force,
                neighbourhoodId
        );
        Map<String, Object> details = restTemplate.getForObject(detailsUrl, Map.class);
        // this may include population
        int population = Integer.parseInt((String) details.get("population"));
        if(population!=0) {
            neighbourhood.setPopulation(population);//only replaces estimated population if police db has one
        }
        Thread.sleep(500);

        //gets lat and long pairs to build custom area
        String boundaryUrl = detailsUrl.concat("/boundary");
        List<Map<String,String>> boundary = restTemplate.getForObject(boundaryUrl, List.class);

        if (boundary == null || boundary.isEmpty()) {
            throw new RuntimeException("No boundary points found for neighbourhood " + neighbourhoodId);
        }

        // Convert to "lat,lng:lat,lng:..." format
        String poly = boundary.stream()
                .map(p -> p.get("latitude") + "," + p.get("longitude"))
                .collect(Collectors.joining(":"));
        Thread.sleep(500);


        Map<String, Integer> crimeTotals = new HashMap<>();
        LocalDate date = LocalDate.now().minusMonths(1);



        //using POST method cause url too long for GET otherwise
        String url = "https://data.police.uk/api/crimes-street/all-crime";
        //building response
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("poly", poly);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        //api call
        List<Map<String, Object>> response = restTemplate.postForObject(url, request, List.class);

        List<CrimeRecord> crimes = new ArrayList<>();
        if (response != null) {
            for (Map<String, Object> crimeMap : response) {
                CrimeRecord cr = new CrimeRecord();

                //sets type to category of crime specified (may group together categories later e.g. different types of theft)
                cr.setType((String) crimeMap.get("category"));

                //get location details if present
                Map<String, Object> location = (Map<String, Object>) crimeMap.get("location");
                if (location != null) {
                    Map<String, Object> coordinates = (Map<String, Object>) location.get("street");
                    cr.setLocation(coordinates != null ? (String) coordinates.get("name") : "Unknown");
                } else {
                    cr.setLocation("Unknown");
                }

                //set lat/lng
                Map<String, Object> loc = (Map<String, Object>) crimeMap.get("location");
                cr.setLatitude(Double.parseDouble((String) loc.get("latitude")));
                cr.setLongitude(Double.parseDouble((String) loc.get("longitude")));

                crimes.add(cr);

                //calc category totals
                String category = (String) crimeMap.get("category");
                crimeTotals.put(category, crimeTotals.getOrDefault(category, 0) + 1);
                //check what date of most recent data is, adds -01 so format valid
                date = LocalDate.parse(((String)crimeMap.get("month")).concat("-01"));
            }
        }

        //add date to body
        body.add("date","");
        //calc totals for remaining 11 months
        for(int i=0;i<11;i++) {
            Thread.sleep(500);//wait 0.5 second between calls so we don't get rate limited

            date = date.minusMonths(1);
            //only taking YYYY-MM part and cutting of -DD
            String dateStr = date.toString().substring(0,7);
            //update date and request
            body.set("date",dateStr);
            request = new HttpEntity<>(body, headers);
            response = restTemplate.postForObject(url, request, List.class);
            if (response != null) {
                for (Map<String, Object> crime : response) {
                    String category = (String) crime.get("category");
                    crimeTotals.put(category, crimeTotals.getOrDefault(category, 0) + 1);
                }
            }
        }

        //set calculated values and return
        neighbourhood.setRecentCrimes(crimes);
        neighbourhood.setCrimeTotalsByType(crimeTotals);
        return neighbourhood;
    }

    private int calcSafetyScore(Map<String, Integer> crimeTotals,int population) {
        //set up crime weights
        Map<String, Integer> crimeWeights = new HashMap<>();
        crimeWeights.put("anti-social-behaviour", 1);
        crimeWeights.put("other-crime", 1);

        crimeWeights.put("shoplifting", 2);
        crimeWeights.put("other-theft", 2);
        crimeWeights.put("public-order", 2);

        crimeWeights.put("vehicle-crime", 3);
        crimeWeights.put("bicycle-theft", 3);
        crimeWeights.put("theft-from-the-person", 3);
        crimeWeights.put("drugs", 3);
        crimeWeights.put("possession-of-weapons", 3);
        crimeWeights.put("criminal-damage-arson", 3);

        crimeWeights.put("burglary", 4);
        crimeWeights.put("robbery", 4);

        crimeWeights.put("violent-crime", 5);
        //calc code
        int weightTotal=0;
        for(Map.Entry<String, Integer> entry : crimeTotals.entrySet()) {
            String category = entry.getKey();
            int count = entry.getValue();
            weightTotal+=count*crimeWeights.get(category);
        }
        //may rework later but good enough
        double crimeRate = (double) weightTotal/population*1000;//crimes per 1k ppl
        double score = 100 / (1 + crimeRate/400);
        int safetyScore = (int) Math.round(score);
        //make sure score in bounds
        safetyScore = Math.max(safetyScore, 0);
        safetyScore = Math.min(safetyScore, 100);
        return safetyScore;
    }

    //adds neighbourhood
    public Neighbourhood addNeighbourhood(Neighbourhood neighbourhood) throws InterruptedException {
        //calls police api and then using long and lat given gets neighbourhood boundary
        //and gets population, recentCrimes and crimeTotalByType
        Neighbourhood updatedNeighbourhood = getCrimeData(neighbourhood);
        //works out safety score using data in crimeTotalByType
        updatedNeighbourhood.setSafetyScore(calcSafetyScore(updatedNeighbourhood.getCrimeTotalsByType(),updatedNeighbourhood.getPopulation()));
        //saves in db
        return neighbourhoodRepository.save(updatedNeighbourhood);
    }
    public List<Neighbourhood> addNeighbourhoods(List<Neighbourhood> neighbourhoods) throws InterruptedException {
        List<Neighbourhood> result = new ArrayList<>();
        for(Neighbourhood neighbourhood : neighbourhoods) {
            result.add(addNeighbourhood(neighbourhood));
        }
        return result;
    }


    //gets all neighbourhoods in db
    public List<Neighbourhood> getAll() {
        return neighbourhoodRepository.findAll();
    }

    //gets neighbourhood in db by unique id if not there gives error 404
    public Neighbourhood getById(Long id) {
        return neighbourhoodRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Neighbourhood not found"));
    }
    //gets page of recent crimes in neighbourhood
    public List<CrimeRecord> getRecentCrimesPage(Long id,int pageNum) {
        List<CrimeRecord> crimes = neighbourhoodRepository.findById(id).get().getRecentCrimes();

        int start = (pageNum - 1) * ITEMS_PER_PAGE;
        int end = Math.min(start + ITEMS_PER_PAGE, crimes.size());

        List<CrimeRecord> page = crimes.subList(start, end);
        return page;
    }
}
