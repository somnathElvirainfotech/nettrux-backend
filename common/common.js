const Jimp = require("jimp");

module.exports = {
  admin_view_path: "../../admin/views/",
  
  resize: async (path, name) => {
    // Read the image.
    const image = await Jimp.read(path);
    // Resize the image to width 150 and heigth 150.
    await image.resize(150, 150).quality(80);
    // Save and overwrite the image
    await image.writeAsync(name);
  },

  passwordGenerator:(length)=>{
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()<>,.?/[]{}-=_+|/0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  numberGenerator:(length)=>{
    var result = "";
    var characters =
      "123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  

};
