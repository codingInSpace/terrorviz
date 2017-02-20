const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  qeventid: Number,
  iyear: Number,
  imonth: Number,
  iday: Number,
  approxdate: Number,
  extended: Number,
  resolution: Number,
  country: Number,
  country_txt: String,
  region: Number,
  region_txt: String,
  provstate: String,
  city: String,
  latitude: Number,
  longitude: Number,
  specificity: Number,
  vicinity: Number,
  location: String,
  summary: String,
  crit1: Number,
  crit2: Number,
  crit3: Number,
  doubtterr: Number,
  alternative: Number,
  alternative_txt: String,
  multiple: Number,
  success: Number,
  suicide: Number,
  attacktype1: Number,
  attacktype1_txt: String,
  attacktype2: Number,
  attacktype2_txt: String,
  attacktype3: Number,
  attacktype3_txt: String,
  targtype1: Number,
  targtype1_txt: String,
  targsubtype1: Number,
  targsubtype1_txt: String,
  corp1: String,
  target1: String,
  natlty1: Number,
  natlty1_txt: String,
  targtype2: Number,
  targtype2_txt: String,
  targsubtype2: Number,
  targsubtype2_txt: String,
  corp2: String,
  target2: String,
  natlty2: Number,
  natlty2_txt: String,
  targtype3: Number,
  targtype3_txt: String,
  targsubtype3: Number,
  targsubtype3_txt: String,
  corp3: String,
  target3: String,
  natlty3: Number,
  natlty3_txt: String,
  gname: String,
  gsubname: String,
  gname2: String,
  gsubname2: String,
  gname3: String,
  ingroup: Number,
  ingroup2: Number,
  ingroup3: Number,
  gsubname3: String,
  motive: String,
  guncertain1: Number,
  guncertain2: Number,
  guncertain3: Number,
  nperps: Number,
  nperpcap: Number,
  claimed: Number,
  claimmode: Number,
  claimmode_txt: String,
  claim2: Number,
  claimmode2: Number,
  claimmode2_txt: String,
  claim3: Number,
  claimmode3: Number,
  claimmode3_txt: String,
  compclaim: String,
  weaptype1: Number,
  weaptype1_txt: String,
  weapsubtype1: Number,
  weapsubtype1_txt: String,
  weaptype2: Number,
  weaptype2_txt: String,
  weapsubtype2: Number,
  weapsubtype2_txt: String,
  weaptype3: Number,
  weaptype3_txt: String,
  weapsubtype3: Number,
  weapsubtype3_txt: String,
  weaptype4: Number,
  weaptype4_txt: String,
  weapsubtype4: Number,
  weapsubtype4_txt: String,
  weapdetail: String,
  nkill: Number,
  nkillus: Number,
  nkillter: Number,
  nwound: Number,
  nwoundus: Number,
  nwoundte: Number,
  property: Number,
  propextent: Number,
  propextent_txt: String,
  propvalue: Number,
  propcomment: String,
  ishostkid: String,
  nhostkid: Number,
  nhostkidus: Number,
  nhours: Number,
  ndays: Number,
  divert: String,
  kidhijcountry: String,
  ransom: Number,
  ransomamt: Number,
  ransomamtus: Number,
  ransompaid: Number,
  ransompaidus: Number,
  ransomnote: String,
  hostkidoutcome: Number,
  hostkidoutcome_txt: String,
  nreleased: Number,
  addnotes: String,
  scite1: String,
  scite2: String,
  scite3: String,
  dbsource: String,
  INT_LOG: Number,
  INT_IDEO: Number,
  INT_MISC: Number,
  INT_ANY: Number,
  related: String
});

IncidentSchema.statics = {
  /**
   * Test retrieval of the first document
   * @returns {Promise|*|Array|{index: number, input: string}}
   */
  testGetOne() {
    return this.find({
      qeventid: 201512310037
    })
    .exec();
  },

  /**
   * List all items
   * @param {number} limit - Limit amount of documents. Default 10000
   * @returns {Promise|*|Array|{index: number, input: string}}
   */
  list(limit = 10000) {
    return this.find().limit(limit).exec();
  },

  /**
   * Get all incidents that occurred in the given year
   * @param {number} year - The year for the incidents. Default 2015
   */
  getYear(year = 2015) {
    return this.find()
      .where('iyear').equals(year)
      .lean()
      .exec();
  }
}

export default mongoose.model('Incident', IncidentSchema);
