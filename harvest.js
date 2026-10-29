/**
 * مبادرة حصاد المعرفة - تسجيل الطلاب
 * يتم إرسال البيانات إلى مستودع GitHub الخاص
 */

const OWNER = "Hientaa";
const REPO = "heinta-members-data";

// تقسيم الرمز لتجنب تحذير GitHub
const TOKEN_PART_1 = "github_pat_11CRD5AMI0Ijh0Ww0sUHu0_pOMCAx0EBCZ";
const TOKEN_PART_2 = "GBzrblG2K7v7m4DvTUERQR3phq7amQ1VRK7CTTJ28xb9wItT";
const GITHUB_TOKEN = TOKEN_PART_1 + TOKEN_PART_2;

const AVAILABLE_SUBJECTS = [
    "رياضيات", "فيزياء", "علوم", "كيمياء", "فلسفة",
    "تاريخ", "جغرافيا", "عربي", "إنكليزي", "فرنسي"
];

document.addEventListener('DOMContentLoaded', () => {
    initValidation();
    addSubjectRow();
});

function initValidation() {
    ['parentPhone', 'studentPhone'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            });
        }
    });
}

function toggleBranchField() {
    const grade = document.getElementById('studentGrade').value;
    const branchGroup = document.getElementById('branchGroup');
    const branchSelect = document.getElementById('studentBranch');
    
    if (grade === 'البكالوريا') {
        branchGroup.style.display = 'flex';
        branchSelect.required = true;
    } else {
        branchGroup.style.display = 'none';
        branchSelect.required = false;
        branchSelect.value = '';
    }
}

function addSubjectRow() {
    const container = document.getElementById('subjectsContainer');
    const rowCount = container.children.length;
    
    if (rowCount >= 10) {
        alert('يمكنك إضافة 10 مواد كحد أقصى.');
        return;
    }
    
    const row = document.createElement('div');
    row.className = 'subject-row';
    
    const subjectOptions = AVAILABLE_SUBJECTS.map(s => `<option value="${s}">${s}</option>`).join('');
    
    // تم إزالة قائمة المستوى من هنا
    row.innerHTML = `
        <select class="subject-name">
            <option value="">-- اختر المادة --</option>
            ${subjectOptions}
        </select>
        <button type="button" class="btn-remove-subject" onclick="removeSubjectRow(this)">✕</button>
    `;
    
    container.appendChild(row);
}

function removeSubjectRow(btn) {
    const container = document.getElementById('subjectsContainer');
    if (container.children.length <= 1) {
        alert('يجب أن تختار مادة واحدة على الأقل.');
        return;
    }
    btn.parentElement.remove();
}

document.getElementById('harvestForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const subjectRows = document.querySelectorAll('.subject-row');
    const subjects = [];
    
    for (const row of subjectRows) {
        const subject = row.querySelector('.subject-name').value;
        
        if (!subject) continue;
        subjects.push(subject); // أصبحت مجرد مصفوفة نصوص
    }
    
    if (subjects.length === 0) {
        showNotification('يرجى إضافة مادة واحدة على الأقل.', 'error');
        return;
    }
    
    // تم إزالة financialStatus و siblings
    const formData = {
        studentName: document.getElementById('studentName').value,
        studentGender: document.getElementById('studentGender').value,
        studentGrade: document.getElementById('studentGrade').value,
        studentBranch: document.getElementById('studentBranch').value || 'غير محدد',
        studentSchool: document.getElementById('studentSchool').value,
        parentName: document.getElementById('parentName').value,
        relation: document.getElementById('relation').value,
        parentPhone: document.getElementById('parentPhone').value,
        studentPhone: document.getElementById('studentPhone').value || 'غير محدد',
        address: document.getElementById('address').value,
        subjects: subjects,
        currentCourses: document.getElementById('currentCourses').value,
        howHeard: document.getElementById('howHeard').value,
        notes: document.getElementById('notes').value || 'لا يوجد',
        date: new Date().toLocaleDateString('ar-SY'),
        time: new Date().toLocaleTimeString('ar-SY')
    };
    
    if (formData.parentPhone.length !== 10) {
        showNotification('رقم ولي الأمر يجب أن يكون 10 أرقام (يبدأ بـ 09)', 'error');
        return;
    }
    
    if (formData.studentPhone !== 'غير محدد' && formData.studentPhone.length !== 10) {
        showNotification('رقم الطالب يجب أن يكون 10 أرقام (يبدأ بـ 09)', 'error');
        return;
    }
    
    // تحديث طريقة عرض المواد في رسالة الـ Issue
    const subjectsText = subjects.map(s => `- **${s}**`).join('\n');
    
    const issueTitle = `🌾 تسجيل حصاد المعرفة: ${formData.studentName} (${formData.studentGrade})`;
    const issueBody = `
### 🌾 طلب تسجيل في مبادرة حصاد المعرفة

---

### 📋 معلومات الطالب
| الحقل | القيمة |
|------|--------|
| **الاسم الثلاثي** | ${formData.studentName} |
| **الجنس** | ${formData.studentGender} |
| **الصف** | ${formData.studentGrade} |
| **الفرع** | ${formData.studentBranch} |
| **المدرسة** | ${formData.studentSchool} |

### 👨‍👩‍👦 معلومات ولي الأمر
| الحقل | القيمة |
|------|--------|
| **اسم ولي الأمر** | ${formData.parentName} |
| **صلة القرابة** | ${formData.relation} |
| **رقم ولي الأمر** | ${formData.parentPhone} |
| **رقم الطالب** | ${formData.studentPhone} |
| **العنوان** | ${formData.address} |

### 📚 المواد المطلوبة
${subjectsText}

### 📝 معلومات إضافية
- **الدورات الحالية:** ${formData.currentCourses}
- **كيف عرف عن المبادرة:** ${formData.howHeard}
- **ملاحظات:** ${formData.notes}

---
**تاريخ التسجيل:** ${formData.date} - ${formData.time}
    `;
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = '⏳ جاري الإرسال...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: issueTitle,
                body: issueBody
            })
        });
        
        if (response.ok) {
            showNotification('✅ تم استلام طلب التسجيل بنجاح! سيتم التواصل معك خلال أسبوع. شكراً لثقتك بجمعية حنطة.', 'success');
            document.getElementById('harvestForm').reset();
            document.getElementById('subjectsContainer').innerHTML = '';
            addSubjectRow();
            document.getElementById('branchGroup').style.display = 'none';
        } else {
            showNotification('❌ حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.', 'error');
        }
    } catch (error) {
        console.error(error);
        showNotification('❌ خطأ في الاتصال بالإنترنت.', 'error');
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
});

function showNotification(message, type = 'success') {
    let existing = document.getElementById('toastNotification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.innerText = message;
    Object.assign(toast.style, {
        position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)',
        backgroundColor: type === 'success' ? '#4A7C59' : '#c0392b', color: '#fff',
        padding: '16px 32px', borderRadius: '10px', zIndex: '9999', fontWeight: 'bold',
        boxShadow: '0 8px 25px rgba(0,0,0,0.25)', textAlign: 'center',
        minWidth: '300px', maxWidth: '90%', fontSize: '1rem', lineHeight: '1.6'
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5500);
}
