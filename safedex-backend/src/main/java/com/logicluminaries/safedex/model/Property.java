package com.logicluminaries.safedex.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private float ppm;//pounds per month

    @ManyToOne
    @JoinColumn(name = "neighbourhood_id")//foreign key
    private Neighbourhood neighbourhood;
}
