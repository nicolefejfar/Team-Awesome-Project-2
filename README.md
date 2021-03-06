#  Twin Cities Neighborhood Dashboard

## Team Members
	• John Clark
	• Nicole Fejfar
	• Jason O'Day
	• Marianne Pagerit
	
## Project Summary
	• Interactive dashboard providing information on crime & housing for Twin Cities neighborhoods

## Database Creation Instructions
	1. Create a database in pgAdmin, name it tc_neighborhoods.
	2. Open a query tool and import query.sql into it.
	3. Run the code in query.sql.
	4. Right click on tables to refresh.
	5. Right click on merged_census_mini, select Import/Export
		a. Toggle switch to "Import"
		b. Select the file merged_census_mini.csv
		c. Leave Format on csv default.
		d. Select UTF-8 encoding.
		e. Toggle Header switch to "yes"
		d. Hit "ok" to submit the form.
	6. Right click on merged_crime, select Import/Export
		a. Toggle switch to "Import"
		b. Select the file merged_census_mini.csv
		c. Leave Format on csv default.
		d. Select UTF-8 encoding.
		e. Toggle Header switch to "yes"
		d. Hit "ok" to submit the form.
	7. The database should now be working. To check, return to the query tool where query.sql is open.
	8. Highlight "select * from merged_crime;" and run code. You should see all the data in that table.
	9. Repeat step 8 with merged_census_mini. All data should be present in this table.
	
## Data Sources
	• GeoJSON Mpls: https://data.world/minneapolismn/055ca54e5fcc47329f081c9ef51d038e-0
		○ GeoJson File download
	• GeoJSON St.Paul: https://information.stpaul.gov/City-Administration/District-Council-Shapefile-Map/dq4n-yj8b
		○ GeoJson file download
	• Census Info: http://www.mncompass.org/profiles/neighborhoods/minneapolis-saint-paul
		○ Demographic info per neighborhood, CSV
		○ Compilation of 2010 census data and American Community Survey info, 2014-2018
	• Crime St Paul: https://information.stpaul.gov/Public-Safety/Crime-Incident-Report-Dataset/gppb-g9cg
		○ St. Paul crime data per neigborhood, 2014 through Oct. 2020, CSV
	• Crime Minneapolis: https://opendata.minneapolismn.gov/datasets/neighborhood-crime-stats
		○ Mpls Crime Stats by neighborhood, 2018 through Sep. 2020, CSV

	• Data merged with GeoJSONs here: https://funkeinteraktiv.github.io/geo-data-merger/
