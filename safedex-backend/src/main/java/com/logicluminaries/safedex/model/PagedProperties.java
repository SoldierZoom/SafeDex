package com.logicluminaries.safedex.model;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
public class PagedProperties {
    @NotNull
    private int totalPages;

    private List<Property> properties;
}
