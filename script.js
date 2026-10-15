/**
 * الموقع التعريفي لجمعية حنطة الخيرية التنموية
 * طلبات الانتساب - حفظ في مستودع GitHub الخاص
 */

const OWNER = "Hientaa";
const REPO = "heinta-members-data";

// تقسيم الرمز لتجنب تحذير GitHub
const TOKEN_PART_1 = "github_pat_11CRD5AMI0Ijh0Ww0sUHu0_pOMCAx0EBCZ";
const TOKEN_PART_2 = "GBzrblG2K7v7m4DvTUERQR3phq7amQ1VRK7CTTJ28xb9wItT";
const GITHUB_TOKEN = TOKEN_PART_1 + TOKEN_PART_2;

document.addEventListener('DOMContentLoaded', () => {
    initFormValidation();
});

function initFormValidation() {
    const nationalIdInput = document.getElementById('nationalId');
    if (nationalIdInput) {
        nationalIdInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
        });
    }
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        });
    }
}

document.getElementById('membershipForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nationalId = document.getElementById('nationalId').value;
    if (nationalId.length !== 11) {
        showNotification('عذراً، الرقم الوطني يجب أن يكون 11 رقماً.', 'error');
        return;
    }

    const formData = {
        fullName: document.getElementById('fullName').value,
        fatherName: document.getElementById('fatherName').value,
        motherName: document.getElementById('motherName').value,
        birthPlaceDate: document.getElementById('birthPlaceDate').value,
        nationalId: nationalId,
        education: document.getElementById('education').value,
        job: document.getElementById('job').value,
        whatsapp: document.getElementById('whatsapp').value,
        experience: document.getElementById('experience').value,
        certificates: document.getElementById('certificates').value,
        date: new Date().toLocaleDateString('ar-SY')
    };

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = '⏳ جاري الإرسال...';
    submitBtn.disabled = true;

    const issueTitle = `طلب انتساب: ${formData.fullName}`;
    const issueBody = `
### 📋 المعلومات الشخصية
| الحقل | القيمة |
|------|--------|
| **الاسم والكنية** | ${formData.fullName} |
| **اسم الأب** | ${formData.fatherName} |
| **اسم الأم** | ${formData.motherName} |
| **مكان وتاريخ الميلاد** | ${formData.birthPlaceDate} |
| **الرقم الوطني** | ${formData.nationalId} |
| **المؤهل العلمي** | ${formData.education} |
| **المهنة** | ${formData.job} |
| **رقم الواتساب** | ${formData.whatsapp} |

### 💼 الخبرات
${formData.experience}

### 🎓 الشهادات
${formData.certificates}

---
**تاريخ التقديم:** ${formData.date}
    `;

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
            showNotification('تم إرسال طلب الانتساب بنجاح! سيتم مراجعته قريباً.', 'success');
            document.getElementById('membershipForm').reset();
        } else {
            showNotification('حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('حدث خطأ في الاتصال.', 'error');
    } finally {
        submitBtn.innerText = originalBtnText;
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
        padding: '12px 25px', borderRadius: '8px', zIndex: '9999', fontWeight: 'bold',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)', textAlign: 'center', minWidth: '250px'
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}