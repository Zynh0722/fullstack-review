const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use native ES6 promises
mongoose.connect('mongodb://localhost/fetcher', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

let userSchema = mongoose.Schema({
  _id: Number,
  name: String,
  avatar: String
});

let repoSchema = mongoose.Schema({
  _id: Number,
  name: String,
  description: String,
  owner: { type: Number, ref: 'User' },
  size: Number,
  forks: Number,
  watchers: Number,
  open_issues: Number,
  stars: Number
});

let User = mongoose.model('User', userSchema);
let Repo = mongoose.model('Repo', repoSchema);

/**
 * Creates a User and adds it to the database
 * given a repository owner object from the github API
 *
 * @param {Object} RepoOwner with id, login, and avatar_url properties
 * @returns A <Promise> that will resolve to either the user added to the database,
 *          or undefined if the user already exists
 */
let _createUser = ({ id, login, avatar_url }) => {
  return User.create({
    _id: id,
    name: login,
    avatar: avatar_url
  })
  .catch(()=>{});
};

/**
 * Takes a repo from the github API and converts
 * it into a mongoose Document based on the Repo model
 *
 * @param {Object} repo
 * @returns A new mongoose Repo document
 */
let _makeUserDoc = (repo) => new Repo({
  _id: repo.id,
  name: repo.name,
  description: repo.description,
  owner: repo.owner.id,
  size: repo.size,
  forks: repo.forks_count,
  watchers: repo.watchers,
  open_issues: repo.open_issues,
  stars: repo.stargazers_count
});

/**
 * Takes an array of github repository information from the github API
 * and returns a promise that can
 *
 * @param {Array} repos list of repos from the github API
 * @returns A <Promise> that will resolve to the number of inserted items
 */
module.exports.save = (repos) => {
  return _createUser(repos[0].owner)
    .then(() =>
      Repo.insertMany(repos.map(repo => _makeUserDoc(repo))));
};

/**
 *
 * @param {*} cb
 */
module.exports.getTop25 = () => {
  Repo.find({}).sort('stars').limit(25).exec()
    .then((docs) => {
      console.log(docs);
    })
};

