import Promise from 'bluebird'
import MongoClient from 'mongodb'

let instance = null

/**
 * Singleton class that contains the MongoClient db object
 */
class dbContainer {
  constructor() {
    if (!instance)
      instance = this;

	console.log(process.env.DB);

    MongoClient.connect(process.env.DB, {
        promiseLibrary: Promise
      })
      .then(db => {
        //console.log(`Connected to ${process.env.DB}`)
        console.log('Connected to the database.')
        this.db = db
        this.incidents = db.collection('incidents')
      })
      .catch(reason => {
        console.error(reason)
      })
  }
}

export default dbContainer
