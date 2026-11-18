import { Router } from 'express';
import { getKnowledgeGraph, mutatePersonRole, createCampus, createExamPaper } from '../controllers/ontology.controller.js';

const router = Router();

router.get('/graph', getKnowledgeGraph);
router.post('/campuses', createCampus);
router.post('/persons/:person_id/mutate-role', mutatePersonRole);
router.post('/exam-papers', createExamPaper);

export default router;
