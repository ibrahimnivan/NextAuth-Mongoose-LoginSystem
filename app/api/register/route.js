import User from "@/models/user"
import connectDB from "@/config/db"
import bcrypt from "bcryptjs"
import { NextResponse } from 'next/server'

export const POST = async (request) => {
  const {username, email, password, confirmPassword} = await request.json()

  if(password !== confirmPassword) {
    return new NextResponse(JSON.stringify({error: "Password do not match"}, {status: 400})) //add new, bcs we dont add json()
  }

  await connectDB()

  // Checking if a user with the given email already exists
  const existingUser = await User.findOne({email})

  if(existingUser) {
    return new NextResponse(JSON.stringify({error: "User already exists"}), {
      status: 400,
    }) //add new
  }

  const hashedPassword = await bcrypt.hash(password, 10); // add 10 gibberish word/char
  const newUser = new User({username, email, password: hashedPassword}) //creates a new instance of the User

  try {
    // Saving the new user to the database
    await newUser.save()
    return new NextResponse('User successfully registered', {status: 201})
  } catch(error) {
    // Handling errors if there's an issue saving the user
    return new NextResponse(error, {status: 500})
  }
}
