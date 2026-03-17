package com.logicluminaries.safedex.model;

import com.logicluminaries.safedex.enums.HouseType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    private String description;//property description (not required)

    @NotBlank
    private String phoneNumber;

    private String email;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "neighbourhood_id")//foreign key
    private Neighbourhood neighbourhood;
}
