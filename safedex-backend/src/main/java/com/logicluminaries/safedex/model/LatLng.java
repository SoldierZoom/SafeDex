package com.logicluminaries.safedex.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LatLng {
    @NotNull
    private double latitude;
    @NotNull
    private double longitude;
}
