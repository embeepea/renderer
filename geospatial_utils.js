/**
 * @fileoverview This file contains utility classes and functions to deal with
 * geospatial data such as points on a map, etc.
 */

const constants = {};

/**
 * The equatorial radius of the earth in meters for a perfectly spherical earth.
 * @type {number}
 */
constants.EARTH_RADIUS_METERS = 6378137;

/**
 * Circumference of Earth in meters.
 * @type {number}
 */
constants.EQUATOR_CIRCUMFERENCE_METERS = 2 * Math.PI *
    constants.EARTH_RADIUS_METERS;

/**
 * This class implements a data structure to store the geolocation of a point on
 * Earth. It also implements functions to convert between different coordinates
 * systems.
 */
class GeoPoint {
  /**
   * Constructs a geographical point (geoPoint) on Earth, with latitude and
   * longitude in micro degrees. A quite custom Web Mercator projection is done
   * such that the full map of earth makes a square between points (-1,-1) for
   * the southwesternmost point and (1, 1) for the northeasternmost point, which
   * is suitable for Waybak's purpose of map representation in a 3D scene.
   * The original Web Mercator, maps the geographic coordinates in a square
   * between points (0,0) for the northwesternmost point and (256, 256) for the
   * southeasternmost point which is suitable for showing map tiles.
   * @param {number} latitudeInMicroDegrees
   * @param {number} longitudeInMicroDegrees
   */
  constructor(latitudeInMicroDegrees, longitudeInMicroDegrees) {
    /** @type {number} */
    this.latitudeInMicroDegrees = latitudeInMicroDegrees;

    /** @type {number} */
    this.longitudeInMicroDegrees = longitudeInMicroDegrees;
  }

  reset(latitudeInMicroDegrees, longitudeInMicroDegrees) {
    this.latitudeInMicroDegrees = latitudeInMicroDegrees;
    this.longitudeInMicroDegrees = longitudeInMicroDegrees;
  }

  /**
   * Returns true if two GeoPoints are equal.
   * @param {!GeoPoint} geoPoint
   * @return {boolean}
   */
  isEqual(geoPoint) {
    return this.latitudeInMicroDegrees == geoPoint.latitudeInMicroDegrees &&
        this.longitudeInMicroDegrees == geoPoint.longitudeInMicroDegrees;
  }

  /**
   * Returns the latitude in degrees.
   * @return {number}
   */
  getLatitudeInDegrees() {
    return this.latitudeInMicroDegrees / 1000000;
  }

  /**
   * Returns the longitude in degrees.
   * @return {number}
   */
  getLongitudeInDegrees() {
    return this.longitudeInMicroDegrees / 1000000;
  }

  /**
   * Returns the latitude in radians.
   * @return {number}
   */
  getLatitudeInRadians() {
    return this.getLatitudeInDegrees() / 180 * Math.PI;
  }

  /**
   * Returns the longitude in radians.
   * @return {number}
   */
  getLongitudeInRadians() {
    return this.getLongitudeInDegrees() / 180 * Math.PI;
  }

  /**
   * Returns the y component of the Mercator coordinates, such that
   * Latitude=-85.051129 corresponds to MercatorX = -1
   * Latitude=+85.051129 corresponds to MercatorX = +1
   * @return {number}
   */
  getMercatorYfromLatitude() {
    return Math.log(Math.tan(Math.PI / 4.0 + this.getLatitudeInRadians() / 2.0))
        / Math.PI;
  }

  /**
   * Returns the x component of the Mercator coordinates,
   * such that
   * Longitude=-180 corresponds to MercatorX = -1 and
   * Longitude=+180 corresponds to MercatorX = +1
   * @return {number}
   */
  getMercatorXfromLongitude() {
    return this.getLongitudeInDegrees() / 180;
  }

  /**
   * Returns the circumference of earth at the latitude of this GeoPoint.
   * @return {number}
   */
  getCircumferenceFromLatitude() {
    return constants.EQUATOR_CIRCUMFERENCE_METERS *
        Math.cos(this.getLatitudeInRadians());
  }

  /**
   * Returns the size of one meter in the Mercator units at this GeoPoint.
   * @return {number}
   */
  getOneMeterInMercatorUnit() {
    // The constant number "2" is the extent of Mercator Coordinates, i.e.:
    // max(MercatorX) - min(MercatorX) = 1 - (-1) = 2.
    return 2 / this.getCircumferenceFromLatitude();
  }
}

export {GeoPoint};