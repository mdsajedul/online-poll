const Poll = require('../model/Poll')

exports.createPollGetController = (req,res,next)=>{
    res.render('create')
}
exports.createPollPostController =async (req,res,next)=>{
    console.log(req.body)

    let {title,description,options} = req.body
    options = options.map((option)=>{
        return{
            name:option,
            vote:0
        }
    })

    let poll = new Poll({
        title,
        description,
        options
    })

    try{
        await poll.save()
        res.redirect('/polls')
    }
    catch(e){
        console.log(e)
    }

    res.render('create')

}

exports.getAllPolls = async (req,res,next)=>{
    try {
        let polls = await Poll.find()
        res.render('polls',{polls})
    } catch (error) {
        console.log(error);
    }
}

exports.viewPollGetController = async (req,res,next)=>{
    let id = req.params.id
    try {
        let poll = await Poll.findById(id)
        let options = [...poll.options]

        let result = []
        options.forEach(option=>{
            let percentage = (option.vote * 100)/poll.totalVote
            result.push({
                ...option._doc,
                percentage:percentage? percentage : 0,
                roundPercentage: Math.round(percentage / 10) * 10
            })
        })
        console.log(result)
        res.render('viewPoll',{poll,result})
    } catch (error) {
        console.log(error);
    }
}

exports.viewPollPostController = async (req, res, next) => {
    const pollId = req.params.id;
    let optionId = req.body.option;
    optionId = optionId.trim()
  
    try {
      const poll = await Poll.findById(pollId);
      const options = [...poll.options];
      const index = options.findIndex(option => option.id === optionId);
  
      if (index === -1) {
        // handle error - option not found
        return res.status(404).send('Option not found');
      }
  
      options[index].vote += 1;
      poll.totalVote += 1;
  
      await poll.save();
  
      res.redirect('/polls/' + pollId);
    } catch (error) {
      console.log(error);
      // handle error - database error or other error
      res.status(500).send('Server error');
    }
  };