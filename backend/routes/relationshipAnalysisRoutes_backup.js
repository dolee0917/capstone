const express = require('express');
const router = express.Router();

const RelationshipAnalysis = require('../models/RelationshipAnalysis_backup');

// 화합/갈등 분석 기록 생성
router.post('/', async (req, res) => {
  try {
    const analysis = await RelationshipAnalysis.create(req.body);

    res.status(201).json({
      message: '분석 기록이 저장되었습니다.',
      analysis
    });
  } catch (error) {
    res.status(400).json({
      message: '분석 기록 저장 실패',
      error: error.message
    });
  }
});

// 화합/갈등 분석 기록 전체 조회 - 최신순
router.get('/', async (req, res) => {
  try {
    const analyses = await RelationshipAnalysis.find()
      .populate('pets', 'name type age')
      .sort({ analyzedAt: -1 });

    res.status(200).json(analyses);
  } catch (error) {
    res.status(500).json({
      message: '분석 기록 조회 실패',
      error: error.message
    });
  }
});

// 특정 분석 기록 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const analysis = await RelationshipAnalysis.findById(req.params.id)
      .populate('pets', 'name type age ownerName');

    if (!analysis) {
      return res.status(404).json({
        message: '해당 분석 기록을 찾을 수 없습니다.'
      });
    }

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({
      message: '분석 상세 조회 실패',
      error: error.message
    });
  }
});

// 분석 기록 수정
router.put('/:id', async (req, res) => {
  try {
    const updatedAnalysis = await RelationshipAnalysis.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedAnalysis) {
      return res.status(404).json({
        message: '해당 분석 기록을 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      message: '분석 기록이 수정되었습니다.',
      analysis: updatedAnalysis
    });
  } catch (error) {
    res.status(400).json({
      message: '분석 기록 수정 실패',
      error: error.message
    });
  }
});

// 분석 기록 삭제
router.delete('/:id', async (req, res) => {
  try {
    const deletedAnalysis = await RelationshipAnalysis.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAnalysis) {
      return res.status(404).json({
        message: '해당 분석 기록을 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      message: '분석 기록이 삭제되었습니다.'
    });
  } catch (error) {
    res.status(500).json({
      message: '분석 기록 삭제 실패',
      error: error.message
    });
  }
});

module.exports = router;