package com.sahfamily.office.entity;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "departments")
public class Department {
    @Id
    private String id;

    @NotBlank(message = "Department name is required")
    @Indexed(unique = true)
    private String name;

    private String description;
    private String location;

    public Department() { }

    public Department(String name, String description, String location) {
        this.name = name;
        this.description = description;
        this.location = location;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
