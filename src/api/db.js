import MongoClient from 'mongodb'

let instance = null

/**
 * Singleton class that contains the MongoClient db object
 */
class dbContainer {
  constructor() {
    if (!instance)
      instance = this;

    MongoClient.connect(process.env.DB, (err, db) => {
      if (err) throw new Error(err)
      console.log(`connected to ${process.env.DB}`)

      this.db = db
      this.incidents = db.collection('incidents')
    })
  }

}

export default dbContainer
