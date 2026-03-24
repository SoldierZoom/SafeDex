package com.logicluminaries.safedex.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
public class Neighbourhood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private int safetyScore;//from 1-100

    @NotNull
    private double latitude;

    @NotNull
    private double longitude;

    @NotNull
    @Positive
    private int population;//estimated population

    @ElementCollection
    private List<LatLng> boundaryPoints;

    @ElementCollection
    @CollectionTable(name = "neighbourhood_crime_totals", joinColumns = @JoinColumn(name = "neighbourhood_id"))
    @MapKeyColumn(name = "category")
    @Column(name = "total")
    private Map<String, Integer> crimeTotalsByType = new HashMap<>();//stores total of each crime in the previous year by type in a map

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "neighbourhood_id")//creates foreign key in crimeRecord
    private List<CrimeRecord> recentCrimes;//stores most recent month of crimes

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getSafetyScore() { return safetyScore; }
    public void setSafetyScore(int safetyScore) { this.safetyScore = safetyScore; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public int getPopulation() { return population; }
    public void setPopulation(int population) { this.population = population; }
    public Map<String, Integer> getCrimeTotalsByType() { return crimeTotalsByType; }
    public void setCrimeTotalsByType(Map<String, Integer> crimeTotalsByType) { this.crimeTotalsByType = crimeTotalsByType; }
    public List<CrimeRecord> getRecentCrimes() { return recentCrimes; }
    public void setRecentCrimes(List<CrimeRecord> recentCrimes) { this.recentCrimes = recentCrimes; }
}
