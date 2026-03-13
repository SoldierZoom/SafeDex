package com.logicluminaries.safedex.controller;

import com.logicluminaries.safedex.model.CrimeRecord;
import com.logicluminaries.safedex.model.Neighbourhood;
import com.logicluminaries.safedex.service.NeighbourhoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/neighbourhoods")
@RequiredArgsConstructor
public class NeighbourhoodController {
    private final NeighbourhoodService neighbourhoodService;

    //adds neighbourhood to db, for testing say may remove
    @PostMapping
    Neighbourhood addNeighbourhood(@RequestBody Neighbourhood neighbourhood) throws InterruptedException {
        return neighbourhoodService.addNeighbourhood(neighbourhood);
    }
    //gets all neighbourhoods in db, for testing so may remove
    @GetMapping
    List<Neighbourhood> getAllNeighbourhoods() {
        return neighbourhoodService.getAll();
    }

    //gets specific neighbourhood with its unique id
    @GetMapping("/{id}")
    Neighbourhood getNeighbourhoodById(@PathVariable Long id) {
        return neighbourhoodService.getById(id);
    }

    //gets page of recent crimes from specified neighbourhood id
    @GetMapping("/{id}/recentCrimes")
    List<CrimeRecord> getRecentCrimes(@PathVariable Long id,@RequestParam(defaultValue = "1") int page) {
        return neighbourhoodService.getRecentCrimesPage(id,page);
    }

}
