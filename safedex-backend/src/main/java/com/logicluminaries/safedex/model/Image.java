package com.logicluminaries.safedex.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(
        name = "images",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"property_id", "position"})
        }
)
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    String path;

    LocalDate creationDate;

    @NotNull
    @Min(1)
    private int position;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id")//foreign key
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Property property;
}
