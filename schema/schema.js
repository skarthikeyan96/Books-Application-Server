const graphQl = require("graphql");
const {
       GraphQLObjectType,
       GraphQLString,
       GraphQLSchema,
       GraphQLID,
       GraphQLInt,
       GraphQLList,
       GraphQLNonNull
      } = graphQl;
const _ = require('lodash');
const Book = require("../models/Book");
const author = require("../models/author");
// const books = [
//   { id :"1" , name : "Three Mistakes of My Life" , genre :"Drama",authorId:'1'},
//   { id :"2" , name : "Da Vinci Code" , genre :"Thriller",authorId:'2'},
//   { id :"3" , name : "HalfGirlFriend" , genre :"Drama",authorId:'1'},
// ]
// const authors = [
//   { id :"1" , name : "Chetan Bhagat" , age :45},
//   { id :"2" , name : "Dan Brown" , age :80},
//   { id :"1" , name : "Chetan Bhagat" , age :45},
// ]
const Booktype = new GraphQLObjectType({
  name :'Book',
  fields: () => ({
    id : {type:GraphQLID},
    name : {type:GraphQLString},
    genre : {type:GraphQLString},
    author : {
      type : Authortype,
      resolve(parent,args){
        console.log(parent)
        //return _.find(authors,{id:parent.authorId})
        return author.findById(parent.authorId)
      }
    }
  })
});
const Authortype = new GraphQLObjectType({
  name :'Author',
  fields: () => ({
    id : {type:GraphQLID},
    name : {type:GraphQLString},
    age : {type:GraphQLInt},
    books: {
      type: new GraphQLList(Booktype),
      resolve(parent,args){
        console.log(parent)
        //return _.filter(books,{authorId:parent.id})
        return Book.find({authorId:parent.id})
      }
    }
  })
});

//define the Root Query

const RootQuery = new GraphQLObjectType({
  name : 'RootQueryType',
  fields : {
    book : { // This refers to the Book type to be queried
      type : Booktype,
      args : { // start of the args
        // this indicates the data to be passed while querying the data
              id : {
                type : GraphQLID
        }
      }, // end of the args
      resolve(parent,args){
          //return _.find(books,{id:args.id});
          return Book.findById(args.id);
      }
    },
    author :{
      type : Authortype,
      args : {
        id :{
          type : GraphQLID
        }
      },
      resolve(parent,args){
        //return _.find(authors,{id:args.id});
        return author.findById(args.id);
      }
    },
    books :{
      type : new GraphQLList(Booktype),
      resolve(parent,args){
        //return books
        return Book.find({});
      }
    },
    authors: {
      type : new GraphQLList(Authortype),
      resolve(parent,args){
        //return authors
        return author.find({});
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name : 'Mutation',
  fields : {
    addAuthor:{
    type:Authortype,
    args : {
      name : {type:new GraphQLNonNull(GraphQLString)},
      age : {type:new GraphQLNonNull(GraphQLInt)},
    },
    resolve(parent,args){
      let Author  = new author({
        name : args.name,
        age : args.age
      });
      return Author.save();
    }
  },
  addBook :{
    type:Booktype,
    args:{
      name:{type:new GraphQLNonNull(GraphQLString)},
      genre:{type:new GraphQLNonNull(GraphQLString)},
      authorID:{type:new GraphQLNonNull(GraphQLID)}
    },
    resolve(parent,args){
      let book = new Book({
        name:args.name,
        genre:args.genre,
        authorId:args.authorID
      });
      return book.save();
    }
  }
}

})
// export the schema

module.exports = new GraphQLSchema({
  query : RootQuery,
  mutation:mutation
})
