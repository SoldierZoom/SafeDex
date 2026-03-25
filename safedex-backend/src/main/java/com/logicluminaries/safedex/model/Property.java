package com.logicluminaries.safedex.model;

import com.logicluminaries.safedex.enums.HouseType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;


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

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Property)) return false;
        Property that = (Property) o;

        // Only compare if both IDs are non-null
        return id != null && id.equals(that.id);
    }
}
