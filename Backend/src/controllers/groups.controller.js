
const { default: mongoose } = require("mongoose");
const groupModel = require("../models/groups.model");


const createGroup = async (req, res) => {
  try {
    const { name, subject, description } = req.body;

    if (!name || !subject) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide name and subject" });
    }

    const newGroup = new groupModel({
      name,
      subject,
      description
    });

    const savedGroup = await newGroup.save();

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: savedGroup,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


const getAllGroups = async (req, res) => {
  try {
    const groups = await groupModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: groups.length, // Optionally include the count
      data: groups,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


const getGroupById = async (req, res) => {
  try {
    const groupId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ success: false, message: 'Invalid group ID format' });
    }

    const group = await groupModel.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, message: `Group not found with id ${groupId}` });
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


const joinGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { memberName } = req.body;
    
    if (!memberName) {
      return res.status(400).json({ success: false, message: 'Please provide a member name to add' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ success: false, message: 'Invalid group ID format' });
    }

    const updatedGroup = await groupModel.findByIdAndUpdate(
      groupId,
      { $push: { members: memberName.trim() } },
      { new: true, runValidators: true }
    );

    
    if (!updatedGroup) {
      return res.status(404).json({ success: false, message: `Group not found with id ${groupId}` });
    }


    res.status(200).json({
      success: true,
      message: `${memberName} added to group ${updatedGroup.name}`,
      data: updatedGroup,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const id = req.params.id;

    if(!mongoose.ObjectId.Types.isValid(id)){
        return res.status(400).json({
            message: "GroupId is not valid"
        })
    }

    const group = await groupModel.findOneAndDelete({_id: id}, {new: true})

    res.status(200).json({
        message: "Group deleted",
        group
    })

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getAllGroups,
  createGroup,
  getGroupById,
  joinGroup,
  deleteGroup,
};
