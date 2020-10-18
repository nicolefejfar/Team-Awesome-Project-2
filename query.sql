-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "merged_crime" (
    City varchar   NOT NULL,
    Neighborhood varchar   NOT NULL,
    Incident varchar   NOT NULL,
    Month int   NOT NULL,
    Year int   NOT NULL,
    Count int   NOT NULL,
    PRIMARY KEY (Neighborhood,Incident,Month,Year)
);

CREATE TABLE "merged_census_mini" (
    "Neighborhood" varchar   NOT NULL,
    "City" varchar   NOT NULL,
    "Total_population" int   NOT NULL,
    "White_Share" varchar   NOT NULL,
    "Of_Color_Share" varchar   NOT NULL,
    "Total_housing_units" int   NOT NULL,
    "Total_households" int   NOT NULL,
    "Family_households_Share" varchar   NOT NULL,
    "Married_fam_hsehlds_Share" varchar   NOT NULL,
    "Nonfam_hsehlds_Share" varchar   NOT NULL,
    "Vacant_housing_units_Share" varchar   NOT NULL,
    "Occupied_housing_units_Share" varchar   NOT NULL,
    "Avg_hsehld_size_occupied" varchar   NOT NULL,
    "Owner_occupied_share" varchar   NOT NULL,
    "Avg_owner_occupied_hsehld_size" varchar   NOT NULL,
    "Renter_occupied_Share" varchar   NOT NULL,
    "Avg_renter_occupied_hsehld_size" varchar   NOT NULL,
    CONSTRAINT "pk_merged_census_mini" PRIMARY KEY (
        "Neighborhood"
     )
);

ALTER TABLE "merged_crime" ADD CONSTRAINT "fk_merged_crime_Neighborhood" FOREIGN KEY("Neighborhood")
REFERENCES "merged_census_mini" ("Neighborhood");

-- -- -- select * from merged_census_mini;
-- select * from merged_crime;