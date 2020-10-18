DROP TABLE merged_census_mini;
DROP TABLE merged_crime;

select * from merged_census_mini;
select * from merged_crime;

ALTER TABLE merged_census_mini ADD PRIMARY KEY ("Neighborhood")
ALTER TABLE merged_crime ADD PRIMARY KEY ("ID")

ALTER TABLE "merged_census_mini" ADD CONSTRAINT "fk_neighboohood" FOREIGN KEY("neighborhood")
REFERENCES "merged_census_mini" ("neighborhood");

-- CREATE TABLE merged_crime (
-- index INT PRIMARY KEY,
-- city TEXT,
-- neighborhood TEXT,
-- incident TEXT,
-- month INT,
-- year INT,
-- count INT
-- );

-- CREATE TABLE merged_census_mini (
-- neighborhood TEXT PRIMARY KEY,
-- city TEXT,
-- total_population INT,
-- white_share INT,
-- of_color_share INT,
-- total_housing_units INT,
-- total_households INT,
-- family_households_share INT,
-- married_fam_hsehlds_share INT,
-- nonfam_hsehlds_share INT,
-- vacant_housing_units_share INT,
-- occupied_housing_units_share INT,
-- avg_hsehld_size_occupied INT,
-- owner_occupied_share INT,
-- avg_owner_occupied_hsehld_size INT,
-- renter_occupied_share INT,
-- avg_renter_occupied_hsehld_size INT
-- );

