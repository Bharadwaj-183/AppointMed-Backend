const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
// const autoIncrement = require("mongoose-auto-increment");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const Schema = mongoose.Schema;

// Define the schema
const appointmentSchema = new Schema({
  Username_doctor: String,
  accId: String,
  doctorEmail: String,
  doctorTimezone: String,
  bookedServicesData: [
    {
      bookingId: { type: String, unique: true },
      orderId: { type: String, unique: true },
      customerEmail: String,
      customerPhoneNumber: String,
      customerName: String,
      amount: String,
      currency: String,
      serviceTitle: String,
      serviceCategory: String,
      serviceNumber: { type: String, unique: true },
      isServicePackage: Boolean,
      packageValidity: String,
      transactionId: String,
      isRescheduled: Boolean,
      isCancelled: Boolean,
      numberOfReschedules: String,
      rescheduledBy: String,
      questionObj: [
        {
          question: String,
          answer: String,
        },
      ],
      contextQuestion: [
        {
          question: String,
          answer: String,
        },
      ],
      transactionStatus: String,
      bookingStatus: String,
      meetingStartTime: String,
      meetingEndTime: String,
      date: {
        day: String,
        month: String,
        weekDay: String,
      },
      customerTimezone: String,
      location: {
        country: String,
        city: String,
        state: String,
      },
      isPaymentSuccessful: Boolean,
      correlationId: String,
    },
  ],
});

// Create a model
const AppointmentModel = mongoose.model("Appointment", appointmentSchema);

const counterSchema = new mongoose.Schema({
  AMA: { type: Number, default: 0 },
  AMB: { type: Number, default: 0 },
  AMC: { type: Number, default: 0 },
  AMO: { type: Number, default: 0 },
  AMS: { type: Number, default: 0 },
  AMT: { type: Number, default: 0 },

  // Add other fields as needed
});

const CounterModel = mongoose.model("Counter", counterSchema);

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://admin-bharadwaj:Bharadwaj_183@cluster0.h2kohig.mongodb.net/appointmentsDB",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected");
  });

dicName = {
  cardiology: "Dr.Mukesh Tripathi",
  ophthalmology: "Dr.Sripriya Reddy",
  dentistry: "Dr.Sunith Kumar",
  ent: "Dr.Naveen Chandra",
  dermatology: "Dr.Jyothi Kulkarni",
  orthopedics: "Dr.Swetha Naidu",
  psychiatry: "Dr.Anil Kumar",
  physiotherapy: "Dr.Senthil Murugan",
};
dicEmail = {
  cardiology: "mukeshtripathi@gmail.com",
  ophthalmology: "sripriyareddy@gmail.com",
  dentistry: "sunithkumar@gmail.com",
  ent: "naveenchandra45@gmail.com",
  dermatology: "jyothkulkarni@gmail.com",
  orthopedics: "swethanaidu22@gmail.com",
  psychiatry: "anilkumar@gmail.com",
  physiotherapy: "senthilmurugan@gmail.com",
};

let dic;
app.post("/submitForm", async (req, res) => {
  // READING COUNTERS
  console.log("GOT DATA FROM FRONTEND", req.body);
  CounterModel.findOne({})
    .then((counters) => {
      console.log("found counters are  ", counters);
      let currAMA = counters.AMA;
      let currAMB = counters.AMB;
      let currAMC = counters.AMC;
      let currAMO = counters.AMO;
      let currAMS = counters.AMS;
      let currAMT = counters.AMT;

      dic = { currAMA, currAMB, currAMC, currAMO, currAMS, currAMT };
      updateAndInsert(dic);
      res.status(200).json({
        message: "Form submitted successfully",
        data: {
          doctorName: dicName[req.body.problem.toLowerCase()],
          consultationType: req.body.consultationType,
          time: new Date().getSeconds() % 2 ? "10 AM" : "11 AM",
        },
      });
    })
    .catch((err) => {
      console.log("error while reading counters", err);
    });

  // UPDATING COUNTER VALUES

  const updateAndInsert = (dic) => {
    //UPDATING
    const updateValues = {
      $inc: {
        AMA: dic.currAMA + 1,
        AMB: dic.currAMB + 1,
        AMC: dic.currAMC + 1,
        AMO: dic.currAMO + 1,
        AMS: dic.currAMS + 1,
        AMT: dic.currAMT + 1,
      },
    };

    const options = { new: true };
    CounterModel.findOneAndUpdate({}, updateValues, options)
      .then((updatedCounters) => {
        if (!updatedCounters) {
          console.log("No counters found to update");
          return;
        } else {
          console.log("updated counters", updatedCounters);
        }
      })
      .catch((err) => {
        console.error("Error updating counters:", err);
      });

    // INSERTING
    data = req.body;
    dicName = {
      cardiology: "Dr.Mukesh Tripathi",
      ophthalmology: "Dr.Sripriya Reddy",
      dentistry: "Dr.Sunith Kumar",
      ent: "Dr.Naveen Chandra",
      dermatology: "Dr.Jyothi Kulkarni",
      orthopedics: "Dr.Swetha Naidu",
      psychiatry: "Dr.Anil Kumar",
      physiotherapy: "Dr.Senthil Murugan",
    };
    dicEmail = {
      cardiology: "mukeshtripathi@gmail.com",
      ophthalmology: "sripriyareddy@gmail.com",
      dentistry: "sunithkumar@gmail.com",
      ent: "naveenchandra45@gmail.com",
      dermatology: "jyothkulkarni@gmail.com",
      orthopedics: "swethanaidu22@gmail.com",
      psychiatry: "anilkumar@gmail.com",
      physiotherapy: "senthilmurugan@gmail.com",
    };

    newAppointment = new AppointmentModel({
      Username_doctor: dicName[data.problem.toLowerCase()],
      accId: "AMA" + (dic.currAMA + 1),
      doctorEmail: dicEmail[data.problem.toLowerCase()],
      doctorTimezone: "IST",
      bookedServicesData: [
        {
          bookingId: "AMB" + (dic.currAMB + 1),
          orderId: "AMO" + (dic.currAMO + 1),
          customerEmail: data.customerEmail,
          customerPhoneNumber: data.customerPhoneNumber,
          customerName: data.customerName,
          amount: "500",
          currency: "INR",
          serviceTitle: data.problem,
          serviceCategory: data.consultationType,
          serviceNumber: "AMS" + (dic.currAMS + 1),
          isServicePackage: false,
          packageValidity: "15 days",
          transactionId: "AMT" + (dic.currAMT + 1),
          isRescheduled: false,
          isCancelled: false,
          numberOfReschedules: 0,
          rescheduledBy: "NA",
          questionObj: [
            {
              question: "explain your problem",
              answer: data.inputProblem,
            },
          ],
          contextQuestion: [
            {
              question: "Since when ?",
              answer: data.duration,
            },
          ],
          transactionStatus: "success",
          bookingStatus: "success",
          meetingStartTime: "10:00 AM",
          meetingEndTime: "10:45 AM",
          date: {
            day: new Date().toJSON().slice(0, 10),
            month: new Date().getMonth() + 1,
            weekDay: new Date().getDay(),
          },
          customerTimezone: "IST",
          location: {
            country: "India",
            city: "Bangalore",
            state: "Karnataka",
          },
          isPaymentSuccessful: true,
          correlationId: "AMC" + (dic.currAMC + 1),
        },
      ],
    });

    newAppointment
      .save()
      .then((savedUser) => {
        console.log("User saved:", savedUser);
        res.send();
      })
      .catch((err) => {
        console.error("Error saving user:", err);
      });
  };
});

// Assuming you have a model defined like this:
// const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

app.get("/getAppointments", async (req, res) => {
  try {
    // Find all appointmentsconsol
    console.log("get appointments called");
    const appointments = await AppointmentModel.find({});

    // Extract and transform data for frontend rendering
    const transformedAppointments = appointments.map((appointment) => ({
      Username_doctor: appointment.Username_doctor,
      bookingId: appointment.bookedServicesData[0].bookingId,
      customerName: appointment.bookedServicesData[0].customerName,
      customerPhoneNumber:
        appointment.bookedServicesData[0].customerPhoneNumber,
      amount: appointment.bookedServicesData[0].amount,
      serviceTitle: appointment.bookedServicesData[0].serviceTitle,
      transactionId: appointment.bookedServicesData[0].transactionId,
      date: appointment.bookedServicesData[0].date,
    }));

    // Return the transformed appointments in the response
    console.log("retrived data in backend ", transformedAppointments);
    res.status(200).json({
      message: "Appointments retrieved successfully",
      data: transformedAppointments,
    });
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    res.status(500).json({ message: "Error retrieving appointments" });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new UserModel({
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Error registering user",
    });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database by email
    const user = await UserModel.findOne({ email });

    if (user) {
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Password is valid, authentication successful
        res.status(200).json({
          message: "Login successful",
        });
      } else {
        // Password is invalid
        res.status(401).json({
          message: "Invalid credentials",
        });
      }
    } else {
      // User not found
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Error during login",
    });
  }
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
