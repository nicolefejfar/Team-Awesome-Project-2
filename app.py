# Import the functions we need from flask
from flask import Flask
from flask import render_template 
from flask import jsonify
from config import password

# Import the functions we need from SQL Alchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

# Define the database connection parameters
username = 'postgres'  
# add the database here
database_name = 'tc_neighborhoods' 
connection_string = f'postgresql://{username}:{password}@localhost:5432/{database_name}'

# Connect to the database
engine = create_engine(connection_string)
base = automap_base()
base.prepare(engine, reflect=True)

# access the crime table
crime_table = base.classes.merged_crime

# pull in data from the census table
census_table = base.classes.merged_census_mini

# Instantiate the Flask application. 
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Effectively disables page caching

# Define application Routes
@app.route("/")
def IndexRoute():

    webpage = render_template("index.html")
    return webpage

@app.route("/about")
def AboutRoute():
    webpage = render_template("about.html", title_we_want="About Us")
    return webpage

@app.route("/crime_data")
def QueryCrimeData():
    # Open a session, run the query, and then close the session again
    session = Session(engine)
    results = session.query(crime_table.city, crime_table.neighborhood, crime_table.incident, \
                crime_table.month, crime_table.year, crime_table.count).all()
    session.close()

    # Create a list of dictionaries, with each dictionary containing one row from the query. 
    all_crime = []
    for City, Neighborhood, Incident, Month, Year, Count in results:
        dict = {}
        dict["city"] = City
        dict["Neighborhood"] = Neighborhood
        dict["Incident"] = Incident
        dict["Month"] = Month
        dict["Year"] = Year
        dict["Count"] = Count
        all_crime.append(dict)

    # Return the jsonified result. 
    return jsonify(all_crime) 

@app.route("/census_data")
def QueryCensusData():

    # Open a session, run the query, and then close the session again
    session = Session(engine)
    results = session.query(census_table.Neighborhood, census_table.City, census_table.Total_population, \
            census_table.White_Share, census_table.Of_Color_Share, census_table.Total_housing_units, \
            census_table.Total_households, census_table.Family_households_Share, \
            census_table.Married_fam_hsehlds_Share, census_table.Nonfam_hsehlds_Share, census_table.Vacant_housing_units_Share, \
            census_table.Occupied_housing_units_Share, census_table.Avg_hsehld_size_occupied, census_table.Owner_occupied_share, \
            census_table.Avg_owner_occupied_hsehld_size, census_table.Renter_occupied_Share, census_table.Avg_renter_occupied_hsehld_size

    ).all()
    session.close()

    # Create a list of dictionaries, with each dictionary containing one row from the query. 
    all_census = []
    for Neighborhood, City, Total_population, White_Share, Of_Color_Share, Total_housing_units, \
         Total_households, Family_households_Share, Married_fam_hsehlds_Share, Nonfam_hsehlds_Share, \
         Vacant_housing_units_Share, Occupied_housing_units_Share, Avg_hsehld_size_occupied, Owner_occupied_share, \
         Avg_owner_occupied_hsehld_size, Renter_occupied_Share, Avg_renter_occupied_hsehld_size in results:
        dict = {}
        dict["Neighborhood"] = Neighborhood
        dict["City"] = City
        dict["Total_population"] = Total_population
        dict["White_Share"] = White_Share
        dict["Of_Color_Share"] = Of_Color_Share
        dict["Total_housing_units"] = Total_housing_units
        dict["Total_households"] = Total_households
        dict["Family_households_Share"] = Family_households_Share
        dict["Married_fam_hsehlds_Share"] = Married_fam_hsehlds_Share
        dict["Nonfam_hsehlds_Sharey"] = Nonfam_hsehlds_Share
        dict["Vacant_housing_units_Share"] = Vacant_housing_units_Share
        dict["Occupied_housing_units_Share"] = Occupied_housing_units_Share
        dict["Avg_hsehld_size_occupied"] = Avg_hsehld_size_occupied
        dict["Owner_occupied_share"] = Owner_occupied_share
        dict["Avg_owner_occupied_hsehld_size"] = Avg_owner_occupied_hsehld_size
        dict["Renter_occupied_Share"] = Renter_occupied_Share
        dict["Avg_renter_occupied_hsehld_size"] = Avg_renter_occupied_hsehld_size
        all_census.append(dict)

    # Return the jsonified result. 
    return jsonify(all_census) 

# final required code for flask server
if __name__ == '__main__':
    app.run(debug=True)