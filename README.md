# gbfs2gjfc
Convert Generalized Bikeshare Feed Specification data to a GeoJSON Feature Collection.

The name is weird, but `gbfs2geojson` [was taken.](https://github.com/motivateco/gbfs2geojson-js)
It's a fine library but I wanted some features it didn't offer, specifically _updating_ an existing feature collection.

## A Note of Caution
This is my first ever attempt at a node module, so I'm sure it has a long way to go. 

On the other hand, I know it works because I'm using it for my [Bike Share Explorer](https://nronnei.github.io/projects/bse/) 
web app.

## To Do List
1. PROMISES! I didn't really understand them when I started writing this. I do now and I need to update.
2. Better SSL options. I've forced it for now, but the fix is hacky and prone to breaking.
3. Better handling for errors in the browser, since that's really where it's meant to be used.
