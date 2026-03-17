package com.logicluminaries.safedex.model;

import com.logicluminaries.safedex.enums.HouseType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;


@Entity
@Data
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String road;

    @NotBlank
    private String postcode;

    @NotNull
    @Enumerated(EnumType.STRING)
    private HouseType type;

    @NotNull
    @Positive
    private float ppm;//pounds per month

    @NotNull
    @Min(1)
    private Integer bedrooms;

    @NotNull
    @Min(1)
    private Integer bathrooms;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "neighbourhood_id")//foreign key
    private Neighbourhood neighbourhood;
}
