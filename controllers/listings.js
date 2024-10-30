 const hotellisting=require("../models/hotel-list");
 module.exports.index=async (req, res) => {
    const listings = await hotellisting.find({});
    res.render("listings/index.ejs", { listings});

}
module.exports.show=async (req, res) => {
    let { id } = req.params;
    const details = await hotellisting.findById(id)
    .populate({
        path:"reviews",
        populate: {
            path:"author",
        },
    })
    .populate("owner");
 
    if(!details){
        req.flash("error","listings which you are looking for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { details});
}
module.exports
.new=(req, res) => {
    res.render("listings/new.ejs");
}
module.exports.
newlistingform=async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,".......",filename);
     console.log(req.file);
    const newlisting = new hotellisting(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={filename,url};
    await newlisting.save();
    console.log(newlisting);
    req.flash("success","Listing is Created!");
    res.redirect("/listings");
}

module.exports.editlisting=async (req, res) => {
    let { id } = req.params;
    let details = await hotellisting.findById(id);
   
    if(!details){
        req.flash("error","listing does not exist!");
        res.redirect("/listings");
    }
   let originalurl=details.image.url;
   let uurl=originalurl.replace("/upload","/upload/h_300,w_100,e_blur:30");
    res.render("listings/update.ejs", { details, uurl});
}
module.exports.updatelisting=async (req, res) => {
    let { id } = req.params;
     let Listing = await hotellisting.findByIdAndUpdate(id, {...req.body.listing});
     
     if (typeof req.file!=="undefined"){
        let url=req.file.path;
     let filename=req.file.filename;
         Listing.image={filename,url};
        
         await Listing.save();
     }
   
    req.flash("success","Listing Modified!");
    res.redirect("/listings");
}
module.exports.deletelisting=async (req, res) => {
    let { id } = req.params;
    await hotellisting.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}
