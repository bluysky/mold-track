document.getElementById("moldForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // 폼 데이터 가져오기
    const mold_id = document.getElementById("moldPrefix").value + "-" +
                    document.getElementById("moldMiddle").value + "-" +
                    document.getElementById("moldSuffix").value;
    const machine_number = document.getElementById("machineNumber").value;
    const status = document.getElementById("status").value;
    const maintenance = document.getElementById("maintenance").value;
    const maintenance_date = document.getElementById("maintenanceDateTime").value;

    // 서버로 데이터 전송
    fetch("http://localhost:3000/add-mold", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mold_id,
            machine_number,
            status,
            maintenance,
            maintenance_date
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Mold added:", data);
        loadMolds(); // 데이터 다시 불러오기
    })
    .catch(error => console.error("Error:", error));
});

// 데이터 불러와서 테이블 업데이트
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
            </tr>`;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => console.error("Error loading molds:", error));
}

// 페이지 로드 시 데이터 불러오기
document.addEventListener("DOMContentLoaded", loadMolds);
