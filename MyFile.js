/**
 * Class for reading and writing file.
 *
 * @class      MyFile
 */
module.exports =  MyFile = class {

  /**
   * Constructs the object.
   *
   * @method     constructor
   * @param      {string}  path    The path
   * @param      {Logger}  logger  The logger
   */
  constructor(path,logger) {
    /**
    * logger logging the activity
    * @property logger 
    * @Type {Logger} 
    */
  	this.logger = logger;
    /**
    * path of the file
    * @property path 
    * @Type {String} 
    */
    this.path = path;
    /**
    * Strings of lines in the file
    * @property lines 
    * @Type {Array} 
    */
    this.lines = new Array();	
  }
  /**
   * Reads lines.
   *
   * @method     readLines
   */
  readLines() {
    var fs = require("fs");
    this.logger.info("Reading file "+this.path+" synchronously with format utf-8");
    var text = fs.readFileSync(this.path, "utf-8");
    this.lines=text.split("\n")
  }

   /**
    * Writes lines into a new file
    *
    * @method     writeLines
    * @param      {string}  path    The path of the new file
    */
  writeLines(path)
  {
    var text = ""
    for(var line of this.lines){
      text = text + line +'\n'
    }
    this.logger.info("Writing file : "+path);
    var fs = require('fs');
    var insideLogger = this.logger;
    fs.writeFile(path, text, function(err) {
      if(err) {
          insideLogger.error("Error writing file " + path + " : " + err);
      }
    }); 
  }

 /**
  * Gets the lines.
  *
  * @method     getLines
  * @return     {Array}  strings representing lines.
  */
  getLines(){
    return this.lines
  }
  /**
   * Sets the lines.
   *
   * @method     setLines
   * @param      {Array}  lines   strings representing lines.
   */
  setLines(lines){
    this.lines = lines;
  }
}
