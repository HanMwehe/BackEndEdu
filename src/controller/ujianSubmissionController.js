import UjianSubmission from '../models/UjianSubmission.js';
import Ujian from '../models/Ujian.js';
import Materi from '../models/Materi.js';
import Jurusan from '../models/Jurusan.js';
import Mahasiswa from '../models/Mahasiswa.js';
import Dosen from '../models/Dosen.js';
// ✅ SUBMIT Ujian MAHASISWA
export const submitUjian = async (req, res) => {
  try {
    const { ujian_id, answers } = req.body;

    const Ujian = await Ujian.findById(Ujian_id);
    if (!Ujian) return res.status(404).json({ error: 'Ujian tidak ditemukan' });

    const mahasiswa = await Mahasiswa.findOne({ user_id: req.user.id });
    if (!mahasiswa) return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });

    const materi = await Materi.findById(Ujian.materi_id).populate('tema_id');
    const jurusanYangBoleh = await Jurusan.find({ tema_id: materi.tema_id._id }).distinct('name');

    if (!jurusanYangBoleh.includes(mahasiswa.fakultas)) {
      return res.status(403).json({ error: 'Ujian ini tidak tersedia untuk jurusan kamu' });
    }

    let submission = await UjianSubmission.findOne({
      Ujian_id,
      mahasiswa_id: mahasiswa._id
    });

    if (submission) {
      if (submission.status === 'graded') {
        return res.status(400).json({ message: 'Ujian sudah dinilai. Tidak bisa submit ulang.' });
      }
      submission.answers = answers;
      submission.submitted_at = new Date();
      submission.status = 'submitted';
    } else {
      submission = new UjianSubmission({
        Ujian_id,
        mahasiswa_id: mahasiswa._id,
        answers,
        submitted_at: new Date(),
        status: 'submitted',
      });
    }

    await submission.save();
    res.status(201).json({ message: 'Ujian submitted', submission });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ GET SEMUA SUBMISSION (untuk dosen/admin)
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await UjianSubmission.find()
      .populate('Ujian_id', 'description')
      .populate('mahasiswa_id', 'name nim');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET SUBMISSION BY ID (detail)
export const getSubmissionById = async (req, res) => {
  try {
    const submission = await UjianSubmission.findById(req.params.id)
      .populate('Ujian_id', 'description')
      .populate('mahasiswa_id', 'name nim');

    if (!submission) return res.status(404).json({ error: 'Submission tidak ditemukan' });

    res.json({
      mahasiswa: {
        nama: submission.mahasiswa_id.name,
        nim: submission.mahasiswa_id.nim
      },
      soal: submission.Ujian_id.description,
      jawaban: submission.answer_text || submission.file_path || '',
      nilai: submission.grade || null,
      feedback: submission.feedback || '',
      status: submission.status,
      submitted_at: submission.submitted_at
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ UPDATE PENILAIAN Ujian (dosen)
export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback, answer_text } = req.body;

    const submission = await UjianSubmission.findById(id);
    if (!submission) return res.status(404).json({ message: 'Submission tidak ditemukan' });

    if (grade !== undefined) submission.grade = grade;
    if (feedback) submission.feedback = feedback;
    if (answer_text) submission.answer_text = answer_text;
    submission.status = 'graded';

    await submission.save();
    res.json({
      message: 'Submission berhasil dinilai',
      submission: {
        Ujian_id: submission.Ujian_id,
        mahasiswa_id: submission.mahasiswa_id,
        grade: submission.grade,
        feedback: submission.feedback,
        status: submission.status,
        submitted_at: submission.submitted_at
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update submission', error: err.message });
  }
};

// ✅ GET SEMUA SUBMISSION SAYA (mahasiswa)
export const getMySubmissions = async (req, res) => {
  try {
    const user_id = req.user.id;
    const mahasiswa = await Mahasiswa.findOne({ user_id });
    if (!mahasiswa) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });

    const submissions = await UjianSubmission.find({ mahasiswa_id: mahasiswa._id })
      .populate('Ujian_id', 'description due_date')
      .sort({ submitted_at: -1 });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil hasil Ujian', error: err.message });
  }
};

// ✅ GET SUBMISSION BERDASARKAN Ujian (khusus dosen)
export const getSubmissionsByUjian = async (req, res) => {
  try {
    const dosen = await Dosen.findOne({ user_id: req.user.id });
    if (!dosen) return res.status(403).json({ message: 'Akses ditolak' });

    const ujian = await Ujian.findById(req.params.Ujian_id).populate({
      path: 'materi_id',
      populate: { path: 'tema_id' }
    });

    if (!ujian || ujian.materi_id.tema_id.dosen_id.toString() !== dosen._id.toString()) {
      return res.status(403).json({ message: 'Bukan ujian milik Anda' });
    }

    const submissions = await UjianSubmission.find({ Ujian_id: req.params.Ujian_id })
      .populate('mahasiswa_id', 'name nim fakultas');

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil submissions', error: err.message });
  }
};


// ✅ GET Ujian YANG BELUM DIKERJAKAN OLEH MAHASISWA
export const getUjianForMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findOne({ user_id: req.user.id });
    if (!mahasiswa) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });

    const temaIdList = await Jurusan.find({
      name: { $regex: new RegExp(`^${mahasiswa.fakultas}$`, 'i') }
    }).distinct('tema_id');

    if (!temaIdList.length) return res.status(404).json({ message: 'Tidak ada tema untuk jurusan ini' });

    const materiIdList = await Materi.find({ tema_id: { $in: temaIdList } }).distinct('_id');

    const semuaUjian = await Ujian.find({ materi_id: { $in: materiIdList } })
      .populate('materi_id', 'title')
      .sort({ created_at: -1 });

    const UjianYangSudahDikerjakan = await UjianSubmission.find({
      mahasiswa_id: mahasiswa._id
    }).distinct('Ujian_id');

    const UjianBelumDikerjakan = semuaUjian.filter(
  (Ujian) => !UjianYangSudahDikerjakan.some((doneId) => Ujian._id.equals(doneId))
)

    res.json(UjianBelumDikerjakan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};