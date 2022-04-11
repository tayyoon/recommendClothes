const express = require('express');
const Comments = require('../schemas/comment');
const Posts = require('../schemas/post');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/', (req, res) => {
    res.send('this is root page');
});

// 코멘트등록
router.post('/comment/:id', authMiddleware, async (req, res) => {
    let { id } = res.params;

    let today = new Date();
    let date = today.toLocaleString();

    const { user } = res.locals;
    let userId = user.userId;
    let userName = user.userName;

    const { comment, image } = req.body;

    if (!comment) {
        return res.status(400).json({
            errorMessage: ' 댓글을 입력해 주세요',
        });
    }

    // const CryptoJS = require('crypto-js');
    // const moment = require('moment');
    // require('moment-timezone');
    // moment.tz.setDefault('Asia/Seoul');
    // const NowDate = String(moment().format('YYYY-MM-DD HH:mm:ss'));
    // const commentNum = CryptoJS.SHA256(NowDate)['words'][0];

    // let commentId = 0;
    // const Comment_list = await Comments.find();
    // if (Comment_list.length) {
    //     num = Comment_list[Comment_list.length - 1]['num'] + 1;
    // } else {
    //     num = 1;
    // }

    // const postId = existsPosts[existsPosts.length-1]+1;

    const createdComment = await Comments.create({
        postId: Number(id),
        userId,
        userName,
        comment,
        // commentId,
        image,
        date,
    });

    res.json({
        post: createdComment,
        msg: '댓글 등록 완료!!',
    });
});

// 코멘트조회 (로그인 ~ing)
router.get('/comment/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { user } = res.locals;
    // let userName = user.userName;

    const comment = await Comments.find({ postId: id });
    const [post] = await Posts.find({ postId: id });

    res.json({
        user,
        post,
        comment,
    });
});

// 코멘트수정시 기존 코멘트 가져오기
router.post('/updatecomment/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { commentId } = req.body;

    let comment = await Comments.find({ commentId: commentId });

    res.send({
        comment,
    });
});

// 코멘트수정 업데이트
router.put('/updatecomment/:id', authMiddleware, async (req, res) => {
    // const { id } = req.params;
    // const { title } = req.body;
    // const { content } = req.body;
    // const { name } = req.body;
    // const { password } = req.body;
    const { comment, commentId } = req.body;

    const existComment = await Comments.find({ commentId: commentId });

    if (existComment.length) {
        await Comments.updateOne(
            { commentId: commentId },
            { $set: { comment } }
        );
    } else {
        return res.status(400).json({
            errorMessage: '잘못된 접근 입니다!!!',
        });
    }

    res.json({ success: '댓글이 수정되었습니다.' });
});

// 코멘트삭제
router.delete('/comment/:id', authMiddleware, async (req, res) => {
    let { id } = req.params; // 로그인을 한 후 맞는 사용자에게만 댓글 수정 ,삭제 버튼이 보이기때문에 필요가 없는가? -> 위쪽 조회에서 이미 userId와 비교가 되는것인가?
    let { commentId } = req.body; // 코멘트 아이디를 바디에서 받아온다 -> 어떻게 받아오지? 어디서?

    const existComment = await Comments.find({ commentId: commentId });
    // commentId를 Comment데이터베이스에서 찾아 commentId 로 일치하는것을 찾앚서 existComment변수에 할당

    if (existComment.length) {
        // existComment가 있으면 length는 최소1개가 되어 조건식이 true,
        await Comments.deleteOne({ commentId: commentId }); // 위의 조건이 true일때 Comments 데이터베이스에서 commentId가 동일한것을 찾아 삭제 시킴
    } else {
        return; // 조건식이 만족하지 않을때 return, 뒤의 실행문이 더이상 진행되지 않는다.
    }

    res.json({ success: '댓글이 삭제되었습니다.' });
});

module.exports = router;
