1. Create a folder with a readme and git ignore file
2. NPM init to get yourself a package.json and your node_modules
3. Install all of your dependencies.
    a. Express
        - const app = express();
        // allow requests to have bodys
        - app.use(express.urlencoded({extended: true}))
    b. Mongoose
    c. Method Override
        - app.use('methodOverride('_method'))
        // allow a method to be passed in a query string to override form action
    d. If using ES6 import Statements:
        i. path
        - const __dirname = path.dirname(__filename);
        ii. {fileToUrlPath} from url
        - const __filename = fileURLToPath(import.meta.url);
        - TO GET FILENAME AND DIRNAME IN A MODULE WE HAVE TO SNAG THOSE INDIVIDUALLY. IMPORTING PATH DOES NOT DO THIS FOR US. DIRNAME AND FILENAME WILL BE UNDEFINED IF WE DONT DO THIS
    e. Ejs
4. Create your app/index js, and import all of your modules
5. Tell your app to listen on a port locally for development
    - app.listen(port, callback);
    - make an app.get() to go ahead and check if everything is A OK at this point
6. Make a views directory for you views engine (ejs)
    a. set views engine - app.set('view engine', 'ejs')
    b. set view directory -  app.set('views', path.join(__dirname, 'views'))
7. Make the models/schemas for your db
    - const yourSchema = new Mongoose.Schema({keyvaluepairsinhere})
    - you may need to export your shema to another file
    a. connect to the Database
    async function connectDb() {
        try {
            await mongoose.connect("mongodb://localhost:27017/yelp-camp");
            console.log("DATABASE CONNECTED");
            } catch (e) {
            console.log("CONNECTION ERROR", e);
                }
            }
            connectDb();
8. Set up your basic routes for CRUD
    a. You are going to have create, read(show), update, delete
    b. The most important is consistent url pattern associated with HTTP verbs
        i. GET /things
        ii. GET /things/{id} (also called SHOW route)
        iii. PATCH /things/{id}
        iv. DELETE /things/{id}
        v. POST /things/new
    c. HOT TAKE, 
        i. when passing data from forms. Your input names can be name="model[parameter]"
            if you want the req.body.model to actually represent what you passed
            const objectPassed = req.body.model
            ii. otherwise, you can name="param", and get them individually from req.body.paramName
9. Adding some Basic Styles
    a. Ejs has an extension called ejs-mate. It lets you abstract a boilerplate for your header/footer
        - make your boilerplate in a layouts folder
        - add <% - body -> where where page content will go
        - make a view that contains the body and include the path to the boilerplate at the top
        - <% layout('pathtoboilerplate') %>
    b. If you are using <%- body -> put a container around it in the boilerplate
    c. Create your partials
        - create a folder in your views directory for your partials
        - include a partial on the boilerplate by placing 
            include('pathtopartial') wherever you want that content
10. Error Handling
    a. Your project really needs to have both client side and server side validation
    b. Bootstrap
        i. Tell the browser not to validate the form
        ii. add required attribute to your inputs
        iii. you will need to add in boostraps custom form validation script. 
        iv. add divs with .valid-feedback that appear when input meets requirements
    c. Error Class
        i. Create a util folder for your error stuff
        ii. Create an error Class
            - class ExpressError extends Error {
                constructor(statusCode, message) {
                    super(); <----- you need super to change any of the values of the class you extend.
                    this.statusCode = statusCode;
                    this.message = message;
                    }
                }
             - Note: you cant throw this error normally in an async function. you would have
                to return next(error) or express breaks. Write a higher order function to catch
                any error in an async function, and pass it into next, so you dont have to 
                write this out individually for every route.
        iii. Write a function that accepts a function as an arg. The function will
                return another function that calls the function that was passed in, and will 
                catch any errors on the passed in function and pass them into next. 
                - function catchAsync(fn) {
                    return (req, res, next) => {
                    fn(req, res, next).catch(next(e));
                    };
                }
                - this will catch errors in async functions, and will pass them to our app.use() error
                    handler at the end of the file. 
    d. More Error Handling
        i. use an app.all('*') at the end of your file to catch any req routes that dont exist
            You can throw an error here, and pass it into next
        ii. app.use() afterwards will catch the error you threw into next. 
        iii. After you set that up, you can throw an error in any route, and it will
                get passed to the app.use error handler on the bottom. 
    e. Defining Error Template
        i. You can throw this in the top level of views folder, since it really is
            another page you are going to show your peeps
11. Validation
    a. JOI Schema Validations
        i. We need client AND server side validation. 
        ii. JOI works by writing a schema for a js object. It will validate your request before
            anything gets to mongoose if you set the schema for the req body. 
        iii. Define a schema, set it to a var, and then call validate on the object that needs to be validated
            -     const campgroundSchema = JOI.object({
                campground: JOI.object({
                        title: Joi.string().required(), <-------- Make sure youre keys match the keys passed in req.body
                        price: Joi.number().required().min(0),
                    }).required(),
                });
                const result = campgroundSchema.validate(req.body);
        iv. We will want to destructure an error out of the validate(obj) method if there is one.
            JOI errors return 'details' which is an array of objects that contain a message. 
            Therefore, we would check for an error, and if there is one, map over the details array, 
            return the messages, and join them at the comma that seperates them. 
                -  const { error } = campgroundSchema.validate(req.body);
                        if (error) {
                            const msg = error.details.map((el) => el.message).join(",");
                            throw new ExpressError(400, msg);
                        }
    b. JOI validation middleware
        i. Movie your code for req schema validation in to its own middleware function
        ii. You also dont want to define your Schema everytime. Move your schema
            definition used in the middleware into a different file if you can. 
12. Making a review module for our camps
    a. Reviews are probably going to be a one to many relationship. For this app,
        we are going to embed a reference to the child (review), on the parent (campground)               
    b. After you define a model, you need to decide where you will make that new data and add that route
    c. Once the form is added, set up the form to hit your route. Confirm the data is being submitted and is
        being added to the Database
    d. Add another validation schema, and create that middleware to pass through to our new route.
    e. displaying those reviews is as easy as populating them on the campground show page.
        IMPORT NOTE
            - At this point, some of this stuff is getting repetitive. Basically, for every new 'Thing' you want to add, 
                1. Find out how it relates to other things and how you want to display it
                2. Create your schema and model
                    - add references to the parent and childs as necessary
                3. add a route to create the thing
                4. add a template or to another template for where you want to create it and show it
                    - make sure this works
                5. pass your error handler onto those routes or make one special if needed
                6. create some sort of validation schema for the data for the Thing
                7. Make the thing look nicer once its all working. 
                8. add the ability to delete and update the thing if you want
                    - if parent/child delete all references
                9. add what happens to parent/child once thing is deleted
    f. Say we want to delete a child, but there is a reference to it in an array on the parent?
       The recommended solution is pull:
        - findByIdAndUpdate(parentId, { $pull: { childarr: childId },
    g. Deleting the parent can make use of a middleware on the model to get rid of children
        - Whatever method you are using to find the parent, will have an associated middleware
          type it triggers. Document, Query, Pre, and Post.
        - SPECIFIC MIDDLEWARE METHODS ARE ONLY TRIGGERED BY THE SPECIFIC METHOD BEING USED TO FIND DOCUMENT
13. Splitting up our routes
    a. To split up routes, make a folder called routes, and some files for your route categories
    b. set const router = express.Router() and export default router.
    c. Import that router into your app file, with the prefix for that route category
        - import catRouter from './pathtocatroutefile'
        - app.use('/category', catRouter)
    d. Your imports will be messed up now. You will have to bring everything you are 
        using into your router file. 
    e. Also, make sure to remove '/category' from the routes in your new router file
    f. if you have ids in your base urls for your router, you will need to pass 
        this option to your express router instance:
         - const router = express.Router({mergeParams: true})
           - This option merges the params in your base url with the params being
             being defined in your routes. You cant access params in your base url
            for your router by default. 
14. Serving static assets
    a. You can use app.use(app.static()) to serve static assets from you main app file
        - app.use(app.static('filetoserve'))
15. Add session storage to your app
    a. npm i install express-session
    b. define a config object to pass into your session initialization
       - app.use(session(sessionConfig));
          i. THIS SHOULD COME BEFORE YOUR ROUTES or it will be missed
    c. You can pass in a cookie object to your config for some settings:
        i. {
                httpOnly: true, <-- prevent cross site scripting
                expires: Date.now() + 1000 * 60 * 60 * 24 * 7, <-- Expires a week from now
                maxAge: 1000 * 60 * 60 * 24 * 7, <-- one week
            },
16. Setting up Flash
    a. npm i Flash
        - app.use(flash());
    b. to use flash in a route:
        - req.flash('key', 'value message')
        - You then need to pass it into whatever route you are using that message on.
          so if you are redirecting, pass it into the route you are redirecting to.
        - A better way to do this is to define a middleware that will look for a flash message.
           You can add your req.flash.success key to res.locals.success. 
           - this adds the contents of our flash success to the locals object of every response
           - you have access to this in your templates automtically.
17. Making a partial for flash
    - extract your flash messages into a partial
    -  You will want to check to see if the key you assigned (success or error)
        contains an empty array in your template, before displaying your error partial. 
    b. To put in a partial for a flash error, we can use the same partial as above
        - we will want to check for an error in that partial, and display it if their is one
        - then we can redirect to a different page (with the error partial included)
            i. Think about what routes could have an error. If you are finding something, 
                you could pass in a flash error if that item is not found. 
                 -router.get(
                    "/:id",
                    catchAsync(async (req, res) => {
                        const thing = await Thing.findById(req.params.id).populate(
                            "things"
                        );
                        if (!thing) {
                            req.flash("error", "Thing not found");
                            return res.redirect("/things");
                        }
                        res.render("things/show", { thing });
                        })
                    );
18. Yelpcamp Authentication (passport)
    a. Using a tool like passport allows us to add in third party authentication
    (google, twitter, facebook) really easily. 
    b. The first thing we need to do is set up a model
        - after we set up our schema Schema.plugin(passportLocalMongoose) will
        give us our username and password fields without any additional work or 
        validation.
    c. Configure app for passport:
        i. Include passport and passport local in main file
        ii. Tell app to use passport.intialize() and passport.session()
            - make sure normal session is called before passport session
        iii. Tell passport to use a local strategy to authenticate username
            - passport.use(new LocalStrategy(User.authenticate()));
        iv. Tell passport how to store a user in the session
            - passport.serializeUser(User.serializeUser());
        v. Tell passport how to get a user out of the session
    d. Registration
        - Make a new router for all of your registration routes. We can call it users
    e. Register: We will need to serve a form to sign up, and login, and make request routes to send 
        the information to create an account, or login to app. 
        i. on the register post route:
            - Grab you req.body params you need
            - make a user with just email and username. Dont make password yet
            - pass the user into the Model.register() method with the password. 
                - this will make sure the password is salted, hashed, and added to your user
            - Flash a message saying it worked <--- Flash is on the request, and is automatically passed onto the ejs template
            - redirect somewhere else
            - Wrap catchAsync around this to pass to default error handler for 
                otherwise unhandled errors.
            - Otherwise, we can throw our own try/catch in here to display a flash error message
    f. Login: In our login route:
        i. Passport gives us a login middleware we can use Passport.authenticate
            - passport.authenticate("local", {
                    failureFlash: true,
                    failureRedirect: "/login",
                }),
        ii. Passport uses our session through serializeUser to keep track of
            a user's signed in status. There is a method called isAuthenticated on the req
            itself (added by passport).
            - to protect routes, we can check to see if that isAuthenticated method on the request
            - rather than doing that on every route, lets put it in a middleware and pass
                that into a route.
    g. Logout: Passport gives us a method called .logout()
      i. Meaning we only need to make a route, and a way to hit that route in our
        app for logging out.
      ii. After logout is added, now we need to add our links for hitting these
            log in and log out routes. We will do it in navbar here. 
      iii. We definitely dont want to show all of the Login, logout, register buttons
            or links all the time. We will want to only show what is relevant to a users
            loggedin status
                - Passport gives us a param on the req called user we can use to
                    verify login status
                - Similar how we pass in our flash messages to every template, lets
                  set another global property in that middleware called req.user. We will
                  then have access to this property on our ejs templates
                - Simply set up some logic on the navbar to check for currentUser, 
                    and display the links that are appropriate for loggedin or not
    h. Lets make a new user auto login when they register
        i. Passport gives us a req.login() method we can use when we register A
            user. 
        ii. the login method cannot be awaited becuase it requires a callback. 
            - for the callback, we can just check for an error. If there is 
              one return next(e), if not, send our flash message and redirect.
    i. ReturnTo behavior: if we force a login, lets send the user back to where they
        were trying to go when the login was forced.
        i. First, we have to keep track of where they were. 
            - When we check for authentication, add the current url to the session
                by tacking on some req params. req.path and *req.url*
        ii. Add req.session.returnTo = req.originalUrl; to your isLoggedIn middleware
        iii. Then, when a user logs in from the forced login screen, 
                if that param exists, redirect to it.
                - delete the req.session.returnTo param after you set the redirecturl
19. Adding authorization
    a. To add authorization to our app, we need to associate an author to a campground,
        or review, and then decide what authors can do to that review, and what other users
        can do or see on that review.
    b. Start with the model, we will store a reference to the user._id on our 
        campground model. 
        i. author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        ii. Now, if we want to display something about the author on the campground show
            page, we need to populate the data for that author. On the campground show
            route, populate the author. We can now access author data on any campground show page. 
        iii. Once that is done, make sure you associate an new campground with the currently
          logged in campground
            - we have access the the user._id on our request from setting up authentication
    c. Now lets make sure someone who isnt a campground owner can't delete someone
        else's campground.
        i. In our templates, we get currentUser from our req middleware, and we get
            author._id from the campground
                - make the delete/edit button on the template dissappear if 
                    these dont match.
                - in our conditional, we have to check if a user exists before continuing on to check
                  the user id. If we try to check the id first and no one is signed in, it will be UNDEFINED
                  and will break everything.
        ii. To protect the routes themselves for deleting and editing, we need to find
            the campground, compare the author to logged in user, then send the request.
        iii. Because there are so many routes we want to protect this way, we can move this into
             a middleware.
             - const isLoggedIn = (req, res, next) => {
                if (!req.isAuthenticated()) {
                    req.session.returnTo = req.originalUrl;
                    req.flash("error", "You must be signed in first!");
                    return res.redirect("/login");
                }
                next();
                };
    d. Next, lets add a reference to a user on the review itself. 
        i. The first bit will be to hide the review form if there is no currentUser
        ii. Then, put the isLoggedIn middleware on our review routes that need it
        iii. When a review is created, set the author parameter on the request to 
               - review.author = req.user._id
        iv. When you show reviews on the campground page, populate the review details
            to show the author of each review
            - this goes back to where we populate all of the reviews for 
              a campground on our campground show route. We want to pass in an 
              object to our populate('reviews') to populate the info for the author
              of each review.
            - this is called a nested populate
            - const campground = await Campground.findById(req.params.id)
                    .populate({
                        path: "reviews",
                        populate: {
                            path: "author",
                        },
                    })
                    .populate("author");
            - To show the review owner on the page just add it to where you generate the reviews
                for each campground.
            - When you do that, throw in some logic to check to see if current user._id matches
                the review author._id, if not dont render that display button.
            - Next, youll want a middleware to protect the review delete route. Check to see if the
                logged in user._id is the same as the author on the review. 
    e. So, all of that was difficult, but this is what makes apps useful to people. How your models relate to 
       one another, what models you can edit, remove, add, and what people can see. Authentication, and authorization 
       are difference between an application being a tool, and application being a business. 
20. Using a controller pattern
    a. Some of our routes are getting pretty crowded. We can move some of the functionality
        onto a controller. 
         i. Example, creating a campground takes like 5 steps. We can create a function
            for this elsewhere, a "campground controller" and then pass that into our
            routes.  
    b. MVC pattern, Model View Controller application
       i. All your model work happens in models, 
       ii. All your rendered content is in views
       iii. Controllers are the heart of the app. This is where the logic happens.
    c.The basic Idea, is to take all "logic" out of your routes, and create very nicely
        named functions in a different file and pass those into your routes.
    d. Do this MVC restructing for all of your routes. 
    e. Router.route... Whats this?
        i. Its like sass... FOR ROUTES
        ii. Router.route can identify a certain route, and dictate what logic is applied
            on said route depending on what request is sent. 
            - router.route("/users/:user_id") 
                .all(logic goes in here)
                .get(logic goes in here)
                .post(etc....)          
        iii. Once the logic is chained on to the req methods, you can get rid of the path
                param in the chained on routes.
20. Image Upload
    a. Forms cant upload by default. You have to add an "enctype" "multipart/form-data"
        attribute to the form itself
    b. To parse the body on these types of forms we need a package called multer
    c. Multer gives middleware to parse:
        - upload.single() <-- pass in the name of the field we want to upload.
        - upload.array()
        - Uploading a file gives us a req.file object we can access in our route
21. Cloudinary
    a. This api requires an API Key. Use package dotenv to store variables in .env file
    b. To store images to cloudinary, we will use multer-storage-cloudinary
        i. create a cloudinary folder or config file to import cloudinary
        ii. import cloudinary and multer-storage-cloudinary
            - You cant actually use ES6 syntax to bring in cloudinary. Import the require() object
                and require cloudinary().v2
        iii. Create a seperate folder for your cloudinary setup. 
        iv. Configure cloudinary to associate your account with this cloudinary instance:
            - export const cloudConfig = cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_KEY,
                api_secret: process.env.CLOUDINARY_SECRET,
                });
        v. Set up a Cloudinary Storage instance:
            - export const storage = new CloudinaryStorage({
                cloudinary,
                params: {
                    folder: "YelpCamp",
                    allowedFormats: ["jpeg", "png", "jpg"],
                },
                });
    c. In the router you will be using to store files, bring in your Cloudinary Storage object, 
        and change your multer upload to use that storage.
    d. your cloudinary-multer-storage package will actually populate req.files with info coming back from cloudinary
    e. now that we can see the req.files, we are going to want to save those file paths
        and names
        i. We will have to update our mongoose model to include params for this. And change our
         Joi schema validation
    f. Add in the image upload as a middlware for your campground post route.
    g. go into your create campgrounds, loop over the array of files, take the params you want to store
        and add them to the campground model you are creating. 
         - you actually have to switch your route to this:
            -   .post(
                    isLoggedIn,
                    upload.array("image"),
                    validateCampground,
                    catchAsync(createCampground)
                );
            - this is because multer is going to upload then send us the parsed body. If we dont 
                upload and parse first, our campground and req.files is empty, so our validate sees images as empty.
    h. Loop over the images and display them in our show.ejs file for campgrounds. 
22. Making a carousel for images
    a. Copy and paste a bootstrap carousel
    b. Loop over images and add image for each one in campground array
        - use foreach for the above so you can snag the index. You have to add
            and active class for the image to show, you want the active class
            to show on the current index. 
    c. Get rid of the buttons if you have 1 or less than 1 image. 
23. Add image upload to edit
    a. Make your form enctype multipart/form-data
    b. add upload.array('image') to you campground PUT route
    c. add the image array to the form input
    d. go to your update campground controller. Add logic for snaging images from req.files
        and PUSH them onto the existing campground images array
        - we cant push by mapping, because map will return an array. We told mongoose images would
            be an array of objects, not and array of arrays. So we need to set our mapping of
            images to variable, map over the images, and then spread that array into the campground
    e. Multer is still taking care of everything and uploading to cloudinary and giving us
        our req.files object we can access.
    f. IN REALITY WE NEED TO LIMIT THE IMAGE SIZE, AMOUNT, VALIDATION, ETC... NOT working
        THESE THINGS OUT CAN COST YOU A TON OF MONEY
24. Delete Images
    a. display images on campground edit template by looping through them and assinging
        ids via the index.
    b. Assign a value to each checkbox as the path to the image. We will use this to delete them
        from cloudinary
        - you will need to add deleteImages[] to your joi schema
        - now, we update a campground, we have this coming through to our update route:
            i.  campground: [Object: null prototype] {
                title: 'new upload',
                location: 'new upload',
                price: '5',
                description: 'sdgl;jkng;dsfngdkjfnglkdsjf'
            },
            deleteImages: [ 'YelpCamp/sdgd1vvfe5jsccwcbdbm', 'YelpCamp/ln6dptfmmbnrnc5smel8' ]
            }
    c. Deleting from the backend
        i. In our update route, to remove them from mongoose:
            - await campground.save();
                if (req.body.deleteImages) {
                    await campground.updateOne({
                    $pull: { images: { filename: { $in: req.body.deleteImages } } },
                });
        ii. Now we have to get rid of the images in cloudinary
            - When you check to see if deleteImages[] exists:
                -     for (let filename of req.body.deleteImages) {
                        await cloudinary.uploader.destroy(filename);
                    }
25. Cloudinary's transformation API for thumbnail images
 a. cloudinary allows us to put params in our url to contstrain images to certain sizes.
 b. to add this params into urls we can add a virtual onto our schema for the images. This means
    we actually need to split our campground up into a campground schema, and an image schema, and
    put the virtual on the image schema itself
 c. Virtuals are not actually stored on the database, it is just derived from a property
    that is already stored on the fly
 d. Once you make a thumbnail virtual on our image in our campground model, you can now access
    that virtual in your ejs template.

25. Adding maps
    a. We can use mapbox geocoding API to get lat and lon for our location on the campground. 
    b. Mapbox has a node client we can use rather than using a get request. mapbox/sdk
    c. Youll have to import:
        i. import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
        ii. Initialize geocoding instance:
            - const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
        iii. send request to get location data in your route
            -   const geoData = await geocoder
                    .forwardGeocode({ query: req.body.campground.location, limit: 1 })
                    .send();
    d. geoJSON
        i. This API actually gives us data in a geoJSON format. This is its own thing
            sort of a subset of JSON. Mongoose has docs on how to add this to a model. 
            hey call it "location"
        ii. add the response to your mapbox call to your model as "geometry"
    e. Mapbox gl js
        i. Include the CDN in the ejs file for your map. 
        ii. Youll have to create a public JS file, and declare your token in your ejs file
        iii. Then you can access your map token in your public js file for the map. 
        iv. do the same thing with your campground. We need the campground to be accessible 
            on the front end to make our calls to the mapbox gl js library. Declare it as a variable
            on the backend, and turn it into a JSON object so it is readable on the front end. 
            

