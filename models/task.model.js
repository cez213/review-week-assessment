var mongoose = require('mongoose')
var _ = require('lodash')
var Task;
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  // setup schema here
  parent: { type: Schema.Types.ObjectId, ref: 'Task'},
  name: { type: String, required: true },
  complete: { type: Boolean, required: true, default: false },
  due: Date
  
});

//virtuals

TaskSchema.virtual('timeRemaining').get(function() {
	if(!this.due) return Infinity;
	else return this.due - new Date();
})

TaskSchema.virtual('overdue').get(function() {
	return this.timeRemaining < 0 && !this.complete;
})

//methods

TaskSchema.methods.addChild = function(params) {
 	return Task.create({
 		parent: this._id,
 		name: params.name
 	});
 }

TaskSchema.methods.getChildren = function() {
	return Task.find({parent: this._id});
}

TaskSchema.methods.getSiblings = function() {
	return Task.find({parent: this.parent}).where('_id').ne(this.id);
}

Task = mongoose.model('Task', TaskSchema);


module.exports = Task;












