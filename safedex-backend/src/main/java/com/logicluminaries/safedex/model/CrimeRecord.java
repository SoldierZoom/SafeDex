package com.logicluminaries.safedex.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class CrimeRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String type;//type of crime
    private double latitude;
    private double longitude;
    private String location;//most recorded crimes specify near street x, near hospital,etc...
}
