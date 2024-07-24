import express from "express";
import {
  getDestination,
  getOsm,
  getParksOSM,
  getPhotonResults,
  getTrailsOSM,
  postSingleGeoJSON,
  getPhotonDetails,
} from "../controllers/getOsmController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OSM
 *   description: OSM routes
 */

/**
 * @swagger
 * /osm/photon/search:
 *   get:
 *     summary: Get Photon search results
 *     tags: [OSM]
 *     parameters:
 *       - in: query
 *         name: searchString
 *         schema:
 *           type: string
 *         required: true
 *         description: The search string for Photon API
 *     responses:
 *       '200':
 *         description: Successful response with Photon search results
 *       '400':
 *         description: Invalid request parameters
 *       '500':
 *         description: Error retrieving Photon results
 */
router.get("/photon/search", getPhotonResults);

/**
 * @swagger
 * /osm/trails:
 *   get:
 *     summary: Get Trails OSM results
 *     tags: [OSM]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: lon
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Successful response with Trails OSM results
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Error retrieving Trails OSM results
 */
router.get("/trails", getTrailsOSM);

/**
 * @swagger
 * /osm/parks:
 *   get:
 *     summary: Get Parks OSM results
 *     tags: [OSM]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: false
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *         required: false
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         required: false
 *     responses:
 *       '200':
 *         description: Successful response with Parks OSM results
 *       '400':
 *         description: Invalid request parameters
 *       '500':
 *         description: Error retrieving Parks OSM results
 */
router.get("/parks", getParksOSM);

/**
 * @swagger
 * /osm:
 *   post:
 *     summary: Get OSM data
 *     tags: [OSM]
 *     requestBody:
 *       required: true
 *       content:
 *         text/plain:
 *           schema:
 *             type: object
 *             properties:
 *               activityType:
 *                 type: string
 *               startPoint:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *               endPoint:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *     responses:
 *       '200':
 *         description: Successful response with OSM data
 *       '400':
 *         description: Invalid request parameters
 *       '500':
 *         description: Error retrieving Overpass Data
 */
router.post("/osm", getOsm);

/**
 * @swagger
 * /process/geojson:
 *   post:
 *     summary: Post a single GeoJSON object
 *     tags: [OSM]
 *     requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             geojson:
 *               type: object
 *     responses:
 *       '201':
 *         description: Successfully created new instance
 *       '400':
 *         description: Invalid or missing geoJSON
 *       '500':
 *         description: Error processing request
 */
router.post("/process/geojson", postSingleGeoJSON);

/**
 * @swagger
 * /destination/{id}:
 *   get:
 *     summary: Get a single destination by ID
 *     tags: [OSM]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the destination
 *     responses:
 *       '200':
 *         description: Successfully retrieved destination
 *       '404':
 *         description: No destination found with provided ID
 *       '500':
 *         description: Error retrieving destination
 */
router.get("/destination/:id", getDestination);

/**
 * @swagger
 * /photonDetails/:type/:id:
 *   get:
 *     summary: Get Photon details for a specific result
 *     tags: [OSM]
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: The type of the Photon result
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the Photon result
 *     responses:
 *       '200':
 *         description: Successful response with Photon details
 *       '400':
 *         description: Invalid request parameters
 *       '500':
 *         description: Error retrieving Photon details
 */
router.get('/photonDetails/:type/:id', getPhotonDetails);


export default router;
