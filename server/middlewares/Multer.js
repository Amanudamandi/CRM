const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        let folder = ''

        if(file.fieldname==='aadhaarPhotos') folder='uploads/aadhar/';
        if(file.fieldname==='pancard') folder='uploads/pancard/';
        if(file.fieldname==='electricitybill') folder='uploads/ElectricityBill/';
        if(file.fieldname==='Video')  folder='uploads/video/';
        if(file.fieldname==='dimensions') folder='uploads/dimensions/';
        if(file.fieldname==='cancelcheack')folder='uploads/cancelcheack/';
        if(file.fieldname==='proposalpdf' ) folder='uploads/proposalpdf/';
        if(file.fieldname==='Document') folder='uploads/DLproposal/';
        if(file.fieldname==='Photos') folder='uploads/Photos/';
        if(file.fieldname==='ELCB') folder='uploads/ELCB/';
        if(file.fieldname==='Roof-Picture') folder='uploads/Roof-Picture';
        if(file.fieldname==='Whatapp') folder='uploads/whatapp';
        console.log(file);
        const uploadDirs = ["uploads/aadhar/", "uploads/pancard/","uploads/ElectricityBill/","uploads/video/","uploads/dimensions/","uploads/cancelcheack/","uploads/proposalpdf/","uploads/DLproposal/","uploads/Photos/","uploads/ELCB/","uploads/Roof-Picture","uploads/whatapp"]
       uploadDirs.forEach(dir => { 
       if (!fs.existsSync(dir)) {
       fs.mkdirSync(dir, { recursive: true });
     }
     });
        cb(null,folder)
        


    },
    filename:(req,file,cb)=>{
        console.log(file,"hello");
        cb(null,`${Date.now()}-${file.originalname}`);
    }
})
// const fileFilter = (req, file, cb) => {
//     if (
//         file.mimetype === "application/pdf" || // PDF files
//         file.mimetype.startsWith("image/")    // Images (Aadhar, PAN)
//     ) {
//         cb(null, true);
//     } else {
//         cb(new Error("Invalid file type! Only PDFs and Images are allowed."), false);
//     }
// };

const upload=multer({storage:storage});
// const uploadMultiplePhotos = upload.array("photos", 10);

module.exports=upload;


