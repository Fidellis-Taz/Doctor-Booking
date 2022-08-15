const Doctor = require("../models/Doctor");
const Schedule = require("../models/Schedule")
/* 
exports.create = async (req, res) => {
    //incoming user data
    console.log(req.body);

    const { doc, checkedDatePhrames, checkedKeys } = req.body;

    try {
        const schedule = await Schedule.findOne({ doctor: doc, date: checkedDatePhrames });
        if (schedule) {
            return res.status(400).json({
                errorMessage: "Schedule already exists",
            });
        }

        const newSchedule = new Schedule();
        newSchedule.doctor = doc;
        newSchedule.date = checkedDatePhrames;
        newSchedule.time = checkedKeys;

        await newSchedule.save();

        res.json({
            successMessage: "newSchedule added successfully.",
            newSchedule
        });
    } catch (err) {
        console.log("schedule error: ", err);
        res.status(500).json({
            errorMessage: "Server error",
        });
    }
};
 */
exports.create = async (req, res) => {
    //incoming user data
    console.log(req.body);

    const { doc, checkedDatePhrames, checkedKeys } = req.body;

    try {
        /*   if (schedule) {
             return res.status(400).json({
                 errorMessage: "Schedule already exists",
             });
         } */


        const doctor = await Doctor.findById(doc)


        doctor.schedule.push({ date: checkedDatePhrames, time: checkedKeys });


        doctor.save(function (err) {
            if (err) return handleError(err)
            console.log('Success!');
            res.json({
                successMessage: "newSchedule added successfully.",
                doctor
            });
        });

    } catch (err) {
        console.log("schedule error: ", err);
        res.status(500).json({
            errorMessage: "Server error",
        });
    }
};
exports.createAllDoctors = async (req, res) => {
    //incoming user data
    console.log(req.body);

    const { checkedDatePhrames, checkedKeys } = req.body;

    try {
        /*   if (schedule) {
             return res.status(400).json({
                 errorMessage: "Schedule already exists",
             });
         } */


        const doctors = await Doctor.find({})
        doctors && doctors.map(doctor => {
            doctor.schedule.push({ date: checkedDatePhrames, time: checkedKeys });

            doctor.save(function (err) {
                if (err) return handleError(err)
                console.log('Success!');

            });
        })
        res.json({
            successMessage: "Doctors schedule added successfully.",

        });



    } catch (err) {
        console.log("schedule error: ", err);
        res.status(500).json({
            errorMessage: "Server error",
        });
    }
};

//create a weekly schedule for all doctors 


exports.list = async (req, res) => {
    try {
        const schedules = await Schedule.find({})

        res.json({ schedules });
    } catch (err) {
        console.log(err, 'schedulesController.readAll error');
        res.status(500).json({
            errorMessage: 'Please try again later',
        });
    }
};
exports.listScheduleByDoctor = async (req, res) => {

    try {
        const doctors = await Doctor.findById(req.params.doctorId)
            .select("schedule")
            .sort({ date: 1 })
            .exec()
        const schedules = doctors.schedule
        res.json({ schedules });
    } catch (err) {
        console.log(err, 'schedulesController.readAll error');
        res.status(500).json({
            errorMessage: 'Please try again later',
        });
    }
};


exports.read = async (req, res) => {

    try {
        const specialization = await Schedule.findById(req.params.specializationId)

        res.json({ specialization });
    } catch (err) {
        console.log(err, 'specializationController.readAll error');
        res.status(500).json({
            errorMessage: 'Please try again later',
        });
    }
};



exports.update = async (req, res) => {
    try {
        const specializationId = req.params.specializationId;
        const specialization = await Schedule.findByIdAndUpdate(specializationId, req.body)

        res.json({ successMessage: `${specialization.name} was successfully edited` });
    } catch (err) {
        console.log(err, 'specializationController.readAll error');
        res.status(500).json({
            errorMessage: 'Please try again later',
        });
    }
};

exports.remove = async (req, res) => {
    try {
        const scheduleId = req.params.scheduleId;
        const doctorId = req.params.doctorId;

        const doctor = await Doctor.findById(doctorId)
        console.log(doctor);
        doctor.schedule.id(scheduleId).remove();
        doctor.save(function (err) {
            if (err) return console.log(err);
            console.log('the subdocs were removed');
            res.status(200).json({
                successMessage: 'Schedule was sucessfully removed',
            });
        });
    } catch (err) {
        console.log(err, 'ScheduleController.readAll error');
        res.status(500).json({
            errorMessage: 'Please try again later',
        });
    }
};