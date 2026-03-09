package com.logicluminaries.safedex.service;

import com.logicluminaries.safedex.model.CrimeRecord;
import com.logicluminaries.safedex.model.Neighbourhood;
import com.logicluminaries.safedex.repository.NeighbourhoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NeighbourhoodService {
    private final NeighbourhoodRepository neighbourhoodRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public Neighbourhood save(Neighbourhood neighbourhood) {
        //fetch latest month of crime data
        List<CrimeRecord> recentCrimes = fetchRecentCrimesForNeighbourhood(neighbourhood.getLatitude(), neighbourhood.getLongitude());
        neighbourhood.setRecentCrimes(recentCrimes);

        //calc total from past year
        Map<String, Integer> totals = getAnnualCrimeTotals(neighbourhood.getLatitude(), neighbourhood.getLongitude(), LocalDate.now().getYear()-1);
        neighbourhood.setCrimeTotalsByCategory(totals);

        return neighbourhoodRepository.save(neighbourhood);
    }

    private List<CrimeRecord> fetchRecentCrimesForNeighbourhood(double lat, double lng) {
        String url = String.format(
                "https://data.police.uk/api/crimes-street/all-crime?lat=%f&lng=%f",
                lat, lng
        );

        // Call API, expect a JSON array of maps
        List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);

        List<CrimeRecord> crimes = new ArrayList<>();
        if (response != null) {
            for (Map<String, Object> crimeMap : response) {
                CrimeRecord cr = new CrimeRecord();

                cr.setType((String) crimeMap.get("category"));

                // Get location details if present
                Map<String, Object> location = (Map<String, Object>) crimeMap.get("location");
                if (location != null) {
                    Map<String, Object> coordinates = (Map<String, Object>) location.get("street");
                    cr.setLocation(coordinates != null ? (String) coordinates.get("name") : "Unknown");
                } else {
                    cr.setLocation("Unknown");
                }

                // Set lat/lng if available
                Map<String, Object> loc = (Map<String, Object>) crimeMap.get("location");
                if (loc != null && loc.get("latitude") != null && loc.get("longitude") != null) {
                    cr.setLatitude(Double.parseDouble((String) loc.get("latitude")));
                    cr.setLongitude(Double.parseDouble((String) loc.get("longitude")));
                } else {
                    cr.setLatitude(lat);
                    cr.setLongitude(lng);
                }

                crimes.add(cr);
            }
        }
        return crimes;
    }

    private Map<String, Integer> getAnnualCrimeTotals(double lat, double lng, int y) {
        Map<String, Integer> totals = new HashMap<>();

        for (int m=1;m<13;m++) {
            // Format month as YYYY-MM
            YearMonth ym = YearMonth.of(y, m);
            String dateStr = ym.toString();

            String url = String.format(
                    "https://data.police.uk/api/crimes-street/all-crime?lat=%f&lng=%f&date=%s",
                    lat, lng, dateStr
            );

            List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);
            if (response != null) {
                for (Map<String, Object> crime : response) {
                    String category = (String) crime.get("category");
                    totals.put(category, totals.getOrDefault(category, 0) + 1);
                }
            }
        }
        return totals;
    }





    public List<Neighbourhood> getAll() {
        return neighbourhoodRepository.findAll();
    }

    public Neighbourhood getById(Long id) {
        return neighbourhoodRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Neighbourhood not found"));
    }
}
