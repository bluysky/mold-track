// 데이터 불러와서 테이블 업데이트 (수정/삭제 버튼 추가)
function loadMolds() {
    fetch("http://localhost:3000/get-molds")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("moldTableBody");
            tableBody.innerHTML = ""; // 기존 데이터 초기화

            data.forEach(mold => {
                const row = `<tr>
                    <td>${mold.mold_id}</td>
                    <td>${mold.machine_number}</td>
                    <td>${mold.status}</td>
                    <td>${mold.maintenance}</td>
                    <td>${mold.maintenance_date}</td>
                    <td>
                        <button onclick="editMold('${mold.mold_id}', '${mold.machine_number}', '${mold.status}', '${mold.maintenance}', '${mold.maintenance_date}')">Edit</button>
                        <button onclick="deleteMold('${mold.mold_id}')">Delete</button>
                    </td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error("Error loading molds:", error));
}

// 수정 버튼 클릭 시 폼에 데이터 채우기
function editMold(mold_id, machine_number, status, maintenance, maintenance_date) {
    document.getElementById("moldPrefix").value = mold_id.split("-")[0];
    document.getElementById("moldMiddle").value = mold_id.split("-")[1];
    document.getElementById("moldSuffix").value = mold_id.split("-")[2];
    document.getElementById("machineNumber").value = machine_number;
    document.getElementById("status").value = status;
    document.getElementById("maintenance").value = maintenance;
    document.getElementById("maintenanceDateTime").value = maintenance_date;

    // 기존 이벤트 리스너 제거 후 새 이벤트 리스너 추가
    const form = document.getElementById("moldForm");
    form.onsubmit = function (event) {
        event.preventDefault();
        updateMold(mold_id);
    };
}

// 수정 요청 보내기
function updateMold(mold_id) {
    const machine_number = document.getElementById("machineNumber").value;
    const status = document.getElementById("status").value;
    const maintenance = document.getElementById("maintenance").value;
    const maintenance_date = document.getElementById("maintenanceDateTime").value;

    fetch(`http://localhost:3000/update-mold/${mold_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ machine_number, status, maintenance, maintenance_date })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Mold updated:", data);
        loadMolds(); // 데이터 다시 불러오기
    })
    .catch(error => console.error("Error updating mold:", error));
}

// 삭제 요청 보내기
function deleteMold(mold_id) {
    if (confirm("정말 삭제하시겠습니까?")) {
        fetch(`http://localhost:3000/delete-mold/${mold_id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => {
            console.log("Mold deleted:", data);
            loadMolds(); // 데이터 다시 불러오기
        })
        .catch(error => console.error("Error deleting mold:", error));
    }
}

// 페이지 로드 시 데이터 불러오기
document.addEventListener("DOMContentLoaded", loadMolds);
