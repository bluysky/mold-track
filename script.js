document.addEventListener('DOMContentLoaded', function () {
    const moldForm = document.getElementById('moldForm');
    const moldTableBody = document.getElementById('moldTableBody');

    // 데이터 로드 함수
    function loadMolds() {
        fetch('http://localhost:3002/get-molds')  // 백엔드 API 주소
            .then(response => response.json())
            .then(data => {
                moldTableBody.innerHTML = '';
                data.forEach(mold => {
                    const row = moldTableBody.insertRow();
                    row.insertCell().textContent = mold.mold_id;
                    row.insertCell().textContent = mold.machine_number;
                    row.insertCell().textContent = mold.status;
                    row.insertCell().textContent = mold.maintenance;
                    row.insertCell().textContent = mold.maintenance_date;

                    // 수정 및 삭제 버튼 추가
                    const actionsCell = row.insertCell();
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.addEventListener('click', () => showEditForm(mold));  // 수정 폼 표시 함수 호출
                    actionsCell.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => deleteMold(mold.mold_id));  // 삭제 함수 호출
                    actionsCell.appendChild(deleteButton);
                });
            });
    }

    // 폼 제출 이벤트 처리
    moldForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const moldPrefix = document.getElementById('moldPrefix').value;
        const moldMiddle = document.getElementById('moldMiddle').value;
        const moldSuffix = document.getElementById('moldSuffix').value;
        const moldId = moldPrefix + moldMiddle + moldSuffix;  // Mold ID 생성

        const machineNumber = document.getElementById('machineNumber').value;
        const status = document.getElementById('status').value;
        const maintenance = document.getElementById('maintenance').value;
        const maintenanceDateTime = document.getElementById('maintenanceDateTime').value;

        const moldData = {
            mold_id: moldId,  // Mold ID 추가
            machine_number: machineNumber,
            status: status,
            maintenance: maintenance,
            maintenance_date: maintenanceDateTime
        };

        fetch('http://localhost:3002/add-mold', {  // 백엔드 API 주소
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(moldData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                loadMolds();  // 테이블 업데이트
                moldForm.reset();  // 폼 초기화
            });
    });

    // 삭제 함수
    function deleteMold(moldId) {
        fetch(`http://localhost:3002/delete-mold/${moldId}`, {  // 백엔드 API 주소
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                loadMolds();  // 테이블 업데이트
            });
    }

    // 수정 폼 표시 함수 (구현 필요)
    function showEditForm(mold) {
        // 여기에 수정 폼을 표시하고, 데이터를 폼에 채우는 코드를 작성합니다.
        // 수정 폼은 HTML에 추가하거나, JavaScript로 동적으로 생성할 수 있습니다.
        // 폼 제출 시 updateMold() 함수를 호출하여 백엔드에 수정 요청을 보냅니다.
        console.log('Edit mold:', mold);
        alert('Edit 기능은 아직 구현 중입니다.');  // 임시 알림
    }

    // 수정 함수 (구현 필요)
    function updateMold(moldId, updatedData) {
        fetch(`http://localhost:3002/update-mold/${moldId}`, {  // 백엔드 API 주소
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                loadMolds();  // 테이블 업데이트
            });
    }

    // 초기 데이터 로드
    loadMolds();
});
