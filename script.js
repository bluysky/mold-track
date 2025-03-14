document.addEventListener('DOMContentLoaded', function () {
    const moldForm = document.getElementById('moldForm');
    const moldTableBody = document.getElementById('moldTableBody');
    const editFormContainer = document.getElementById('editFormContainer');
    const editMoldForm = document.getElementById('editMoldForm');

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

    // 수정 폼 표시 함수
    function showEditForm(mold) {
        // 폼 필드에 데이터 채우기
        document.getElementById('editMachineNumber').value = mold.machine_number;
        document.getElementById('editStatus').value = mold.status;
        document.getElementById('editMaintenance').value = mold.maintenance;
        document.getElementById('editMaintenanceDateTime').value = mold.maintenance_date;
        document.getElementById('editMoldId').value = mold.mold_id;  // Mold ID 설정

        // 폼 표시
        editFormContainer.style.display = 'block';
    }

    // 수정 폼 숨기기 함수
    window.hideEditForm = function () {
        editFormContainer.style.display = 'none';
    }

    // 수정 함수
    editMoldForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const moldId = document.getElementById('editMoldId').value;  // Mold ID 가져오기
        const updatedData = {
            machine_number: document.getElementById('editMachineNumber').value,
            status: document.getElementById('editStatus').value,
            maintenance: document.getElementById('editMaintenance').value,
            maintenance_date: document.getElementById('editMaintenanceDateTime').value
        };

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
                hideEditForm();  // 폼 숨기기
            });
    });

    // 초기 데이터 로드
    loadMolds();
});
