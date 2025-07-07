# axios -> we do not need to use resopnse.json() and automaticaly handle error if occur


************judg 0 *****************

In fisrt req -> gives us token that token is used to make another api call to obtain result

# pagination -> const problem = await Problem.find({}).skip((page-1)*lim).limit(lim);
# req -> localhost:3000/problem/getAll?pages=2?limit=10

# filteration method :- 

Operator   Meaning                         Example URL Query               MongoDB Equivalent
$eq        Equal                           ?difficulty=easy                { difficulty: "easy" }
$ne        Not equal                       ?difficulty[ne]=hard            { difficulty: { $ne: "hard" }}
$gt        Greater than                    ?votes[gt]=100                  { votes: { $gt: 100 } }
$gte       Greater than or equal           ?votes[gte]=100                 { votes: { $gte: 100 } }
$lt        Less than                       ?votes[lt]=50                   { votes: { $lt: 50 } }
$lte       Less than or equal              ?votes[lte]=50                  { votes: { $lte: 50 } }
$in        Match any value in array        ?tags[in]=array,hashmap         { tags: { $in: ["array", "hashmap"] } }
$nin       Exclude values in an array      ?tags[nin]=dp                   { tags: { $nin: ["dp"] } }


# const ans = await User.findById(id).populate('problemSolved');  -> fetch all problems

# INDEXING ->  _id and those feilds that have unique : true

# if a fields have duplicate prop -> that can also have indexing

# for efficient searching of submission of a particular ques that a user submitted  -> give indexing (index:true) -> do not use Indexing for all feilds because it takes memeory so we use index for feilds that we need frequently

# but for a specific user's sol of a particular  ques -> we need id of user and problem and make query taking both so for this types of situation we use compound indexing -> means index through combining both ids 

# submissionSchema.index({userId:1,problemId:1})  -> now we can apply efficiently serach submission  and also efficiently serach userId  

# rate-limitor => Homework