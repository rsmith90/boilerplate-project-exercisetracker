const mongoose = require("mongoose");
const { User } = require("./schema.js");

const addNewUser = async (newUserName) => {
  try {
    const newUser = new User({ username: newUserName });

    const newSavedUser = await newUser.save();
    return newSavedUser;
  } catch (e) {
    throw new Error("User not Saved");
  }
};

const getAllUsers = async () => {
  try {
    const allUsersArray = await User.find();
    return allUsersArray;
  } catch (e) {
    console.log(e);
    throw new Error("Can't get Users from DB.");
  }
};

const findandUpdateUser = async (userId, objWithNewProps) => {
  try {
    const updatedUsers = await User.findByIdAndUpdate(
      userId,
      {
        $push: { exercise: objWithNewProps },
      },
      { new: true }
    );

    const objToReturn = {
      username: updatedUsers.username,
      description: objWithNewProps.description,
      duration: objWithNewProps.duration,
      _id: userId,
      date: objWithNewProps.date,
    };
    return objToReturn;
  } catch (e) {
    console.error(e);
    throw new Error("Cannot update users exercise details");
  }
};

const addNewExercise = async (exerciseDetailObj) => {
  try {
    const objWithNewProps = {
      description: exerciseDetailObj.description,
      duration: exerciseDetailObj.duration,
      date: exerciseDetailObj.date,
    };
    const updatedUser = await findandUpdateUser(
      exerciseDetailObj.id,
      objWithNewProps
    );
    if (updatedUser) {
      const objToReturn = {
        user: updatedUser.username,
        _id: updatedUser._id,
        description: updatedUser.description,
        duration: new Date(exerciseDetailObj.date).toDateString(),
      };
      return objToReturn;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    throw new Error("Exercise did not save.");
  }
};

const fetchExercisesLog = async (objReqReceived) => {
  try {
    const thisUser = await User.findById(objReqReceived.userId);
    let allExercises = null;
    if (thisUser && thisUser.exercises) {
      allExercises = thisUser.exercises;
    } else {
      console.log(
        `User with id: ${objReqReceived.userId} doesn't exist or doesn't have array.`
      );
      return null;
    }

    if (objReqReceived.fromDate && allExercises && allExercises.length > 0) {
      allExercises = allExercises.reduce(function (filtered, exercise) {
        const fromDateFromParams = new Date(objReqReceived.fromDate).getTime();
        const dateRetrieved = new Date(exercise.date).getTime();
        if (dateRetrieved >= fromDateFromParams) {
          filtered.push(exercise);
        }
        return filtered;
      }, []);
    }

    if (objReqReceived.toDate && allExercises && allExercises.length > 0) {
      allExercises = allExercises.reduce(function (filtered, exercise) {
        const toDateFromParams = new Date(objReqReceived.toDate).getTime();
        const dateRetrieved = new Date(exercise.date).getTime();
        if (dateRetrieved <= toDateFromParams) {
          filtered.push(exercise);
        }
        return filtered;
      }, []);
    }
    
//     log array of exercises
    if(allExercises && allExercises.length > 0){
      
      allExercises = allExercises.map(exercise => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date
      }));
      
    }
//     slice limiter
    if(objReqReceived.limit && allExercises && allExercises.length > 0){
      allExercises = allExercises.slice( 0, objReqReceived.limit);
    }
    
    const exerciseLogForThisUser = {
      username: thisUser.username,
      count: allExercises.length,
      _id: objReqReceived.userId,
      log: allExercises,
    }
    
    return exerciseLogForThisUser;
    
  } catch (e) {
    console.error(e);
    return null
  }
};

module.exports = { addNewUser, getAllUsers, addNewExercise, fetchExercisesLog };
