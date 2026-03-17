package com.logicluminaries.safedex.model;

import com.logicluminaries.safedex.enums.HouseType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String road;
    private String postcode;
    @Enumerated(EnumType.STRING)
    private HouseType type;
    private float ppm;//pounds per month
    private Integer bedrooms;
    private Integer bathrooms;

    @ManyToOne
    @JoinColumn(name = "neighbourhood_id")//foreign key
    private Neighbourhood neighbourhood;
}
