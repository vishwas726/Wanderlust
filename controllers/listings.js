const Listing = require("../models/listing")
const ExpressErr = require("../utils/ExpressErr.js")

let mapToken = process.env.MAP_TOKEN
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapToken });




module.exports.index = async (req, res, next) => {

    const allListings = await Listing.find({});
    // console.log(allListings)
    // res.send(allListings)

    res.render("listings/index.ejs", { allListings });

}


module.exports.renderNewForm = (req, res) => {
    // console.log(req.user)

    // if(!req.isAuthenticated()){

    //     req.flash("error" , "You Must Logged In To Create Listing");
    //     res.redirect("/login")

    //   }

    res.render("listings/new.ejs")

}

module.exports.updateListing = async (req, res) => {

    let { id } = req.params;
    const newlisting = req.body.listing

    if (!req.body.listing) {

        //next(new ExpressErr(400 , "Send valid data")) // becase we alredy used next in wrapAsync
        throw new ExpressErr(400, "Send valid data");

    }
    let listing = await Listing.findByIdAndUpdate(id , newlisting)

    if (req.file) {

        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { filename, url }
    }

    await listing.save();
    req.flash("success", "Listing Updated Succefully")

    res.redirect(`/listings/${id}`)

}


module.exports.showListing = async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id)

        .populate({
            path: "reviews",
            populate: {

                path: "author"
            }

        }).populate("owner")
    // console.log(listing)
    if (!listing) {
        req.flash("error", "Listing Dosen't Exists")

        return res.redirect("/listings")

    }

    // console.log(  req.user)
    res.render("listings/show.ejs", { listing })

}

module.exports.createListing = async (req, res) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send()
    // console.log(response.body.features[0].geometry)


   
    //listing is a object
    const newlisting = new Listing(req.body.listing)

    //    if(!req.body.listing){

    //     //next(new ExpressErr(400 , "Send valid data")) // becase we alredy used next in wrapAsync
    //       throw new ExpressErr(400 , "Send valid data");

    //    }
    newlisting.owner = req.user._id;
    newlisting.geometry = response.body.features[0].geometry; //from mapbox

    
    if (req.file) {

        //store file
        let url = req.file.path;
        let filename = req.file.filename;
        newlisting.image = { filename, url }
        // console.log(url + "..... " + filename)

    }

    
    
    await newlisting.save();
    req.flash("success", "Listing Created Succefully")
    res.redirect("/listings")

}

module.exports.renderEditForm = async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Listing Dosen't Exists")
        res.redirect("/listings")
    }

    let originalImg = listing.image.url;
    originalImg.replace("/upload", "/upload/h_300,w_250")

    res.render("listings/edit.ejs", { listing, originalImg })

}



module.exports.destroyListing = async (req, res) => {

    let { id } = req.params;

    await Listing.findByIdAndDelete({ _id: id })

    req.flash("success", "Listing Deleted Succefully")

    res.redirect("/listings")

}