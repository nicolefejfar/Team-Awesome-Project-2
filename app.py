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
database_name = 'GlobalFirePower' 
connection_string = f'postgresql://{username}:{password}@localhost:5432/{database_name}'

# Connect to the database
engine = create_engine(connection_string)
base = automap_base()
base.prepare(engine, reflect=True)

# Choose the table we wish to use
table = base.classes.firepower

# Instantiate the Flask application. 
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Effectively disables page caching

# Define application Routes
@app.route("/")
def IndexRoute():

    webpage = render_template("index.html")
    return webpage

@app.route("/about")
def OtherRoute():
    ''' This function runs when the user clicks the link for the other page.
        Note that the html file must be located in a folder called templates. '''

    # Note that this call to render template passes in the title parameter. 
    # That title parameter is a 'Shirley' variable that could be called anything 
    # we want. But, since we're using it to specify the page title, we call it 
    # what we do. The name has to match the parameter used in other.html. 
    webpage = render_template("about.html", title_we_want="About Us")
    return webpage

@app.route("/data")
def QueryFighterAircraft():
    ''' Query the database for fighter aircraft and return the results as a JSON. '''

    # Open a session, run the query, and then close the session again
    session = Session(engine)
    results = session.query(table.country, table.iso3, table.fighteraircraft).all()
    session.close()

    # Create a list of dictionaries, with each dictionary containing one row from the query. 
    all_aircraft = []
    for country, iso3, fighteraircraft in results:
        dict = {}
        dict["country"] = country
        dict["iso3"] = iso3
        dict["fighteraircraft"] = fighteraircraft
        all_aircraft.append(dict)

    # Return the jsonified result. 
    return jsonify(all_aircraft) 

# final required code for flask server
if __name__ == '__main__':
    app.run(debug=True)