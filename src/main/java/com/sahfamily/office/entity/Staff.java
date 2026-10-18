package com.sahfamily.office.entity;

import java.math.BigDecimal;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "staff")
public class Staff {
    @Id
    private String id;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Enter a valid email address")
    @NotBlank(message = "Email is required")
    @Indexed(unique = true)
    private String email;

    private String phone;
    @NotBlank(message = "Job title is required")
    private String jobTitle;
    @NotNull(message = "Salary is required")
    @PositiveOrZero(message = "Salary must be zero or greater")
    private BigDecimal salary;
    @NotBlank(message = "Department ID is required")
    private String departmentId;

    public Staff() { }

    public Staff(String fullName, String email, String phone, String jobTitle, BigDecimal salary, String departmentId) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.jobTitle = jobTitle;
        this.salary = salary;
        this.departmentId = departmentId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
}
