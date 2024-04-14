const Product = require("../models/products");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ products, nbhits: products.length });
};

const getAllProducts = async (req, res) => {
  //console.log(req.query);
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorsMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorsMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
    console.log(numericFilters);
  }

  console.log(queryObject);
  let result = await Product.find(queryObject);
  if (sort) {
    console.log(sort);
    const sortList = sort.split(",").join("");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  if (fields) {
    console.log(fields);
    const fieldsList = fields.split(",").join("");
    result = result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const products = await result;
  res.status(200).json({ products, nbhits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};

// Online C# Editor for free
// Write, Edit and Run your C# code using C# Online Compiler

// using System;

// public class HelloWorld
// {
//     public static void findPattern(string text, string pattern) {
//         bool patternFound = false;
//         string OutputString = "Output found at ";
//         int patternFoundStartingIndex = -1;
//         for(int j = 0; j < text.Length; j++) {
//             for(int i = 0; i< pattern.Length; i++) {
//                 if((j+i) < text.Length && text[j + i] == pattern[i]) {
//                     patternFound = true;
//                 } else {
//                     patternFound = false;
//                 }
//             }
//             if(patternFound) {
//                 patternFoundStartingIndex = j;
//                 OutputString += j.ToString() + ", ";
//             }
//         }
//         OutputString += "and " + patternFoundStartingIndex.ToString();
//          Console.WriteLine (OutputString);
//     }
//     public static void Main(string[] args)
//     {
//         Console.WriteLine ("goodbye cruel world");
//         findPattern("AABABADABAJAAABAHGAACAABAAACAABA","AABA");
//     }
// }
