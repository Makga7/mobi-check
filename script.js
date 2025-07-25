// 퀘스트 데이터 정의 (물물교환)
let questData = [
    { type: 'weekly', location: '반호르', npc: '아이데른', need: '농어 매운탕', needCount: 1, reward: '은합금괴', rewardCount: 10 },
    { type: 'weekly', location: '콜헨', npc: '킬리언', need: '3만 골드', needCount: 1, reward: '깔끔 버섯 진액', rewardCount: 30 },
    { type: 'accountWeekly', location: '티르코네일', npc: '엔델리온', need: '특제빵', needCount: 10, reward: '성수', rewardCount: 10 },
    { type: 'daily', location: '티르코네일', npc: '퍼거스', need: '강철괴', needCount: 8, reward: '합금강괴', rewardCount: 4 },
    { type: 'daily', location: '티르코네일', npc: '케이틴', need: '우유', needCount: 10, reward: '특제 빵', rewardCount: 3 },
    { type: 'daily', location: '티르코네일', npc: '메이븐', need: '특제 빵', needCount: 1, reward: '성수', rewardCount: 1 },
    { type: 'daily', location: '두갈드 아일', npc: '엘빈', need: '야채 볶음', needCount: 2, reward: '상급 목재', rewardCount: 8 },
    { type: 'daily', location: '두갈드 아일', npc: '트레이시', need: '통나무', needCount: 10, reward: '생가죽', rewardCount: 10 },
    { type: 'daily', location: '두갈드 아일', npc: '트레이시', need: '통나무', needCount: 100, reward: '상급 생가죽', rewardCount: 10 },
    { type: 'daily', location: '던바튼', npc: '네리스', need: '동광석', needCount: 10, reward: '상급 생가죽', rewardCount: 10 },
    { type: 'daily', location: '던바튼', npc: '네리스', need: '합금강괴', needCount: 8, reward: '특수강괴', rewardCount: 4 },
    { type: 'daily', location: '던바튼', npc: '제이미', need: '사과 생크림 케이크', needCount: 1, reward: '상급 옷감+', rewardCount: 4 },
    { type: 'daily', location: '던바튼', npc: '제롬', need: '크림소스 스테이크', needCount: 1, reward: '상급 실크+', rewardCount: 4 }
];

// 퀘스트 데이터 정의 (일반 퀘스트)
let questManagementData = [
    { type: 'accountDaily', name: '캐시샵', count: 1, category: '의상 / 보석상자' },
    { type: 'daily', name: '던전', count: 1, category: '일일 던전' },
    { type: 'daily', name: '결계', count: 2, category: '일일' },
    { type: 'daily', name: '일반 / 심층 구멍', count: 3, category: '일일' },
    { type: 'daily', name: '어비스 구멍', count: 3, category: '일일' },
    { type: 'daily', name: '망령의 탑', count: 5, category: '일일' },
    { type: 'weekly', name: '필드보스', count: 3, category: '전투' },
    { type: 'weekly', name: '어비스 던전', count: 3, category: '던전' },
    { type: 'weekly', name: '레이드', count: 2, category: '레이드' },
    { type: 'weekly', name: '케이틴', count: 1, category: '재료구매' },
    { type: 'weekly', name: '글리니스', count: 1, category: '재료구매' },
    { type: 'weekly', name: '제니퍼', count: 1, category: '재료구매' },
];

// 재료 데이터 정의
let materialData = [
    { name: '강철괴' },
    { name: '은합금괴' },
    { name: '통나무' },
    { name: '생가죽' }
];

// 재료 데이터 로드/저장
function loadMaterialData() {
    const stored = localStorage.getItem('mabinogi_material_data');
    if (stored) {
        try {
            const parsedData = JSON.parse(stored);
            if (Array.isArray(parsedData) && parsedData.every(material => material.name)) {
                materialData = parsedData;
            } else {
                console.warn('잘못된 재료 데이터 형식, 기본값으로 복원');
                materialData = [
                    { name: '강철괴' },
                    { name: '은합금괴' },
                    { name: '통나무' },
                    { name: '생가죽' }
                ];
                saveMaterialData();
            }
        } catch (error) {
            console.error('Failed to load material data:', error);
            saveMaterialData();
        }
    } else {
        saveMaterialData();
    }
    return materialData;
}

// 재료 추가
function addMaterial() {
    const name = document.getElementById('materialName').value.trim();

    if (!name) {
        alert('재료명을 입력해주세요!');
        return;
    }

    if (materialData.some(material => material.name === name)) {
        alert('이미 존재하는 재료입니다!');
        return;
    }

    const currentEditIndex = document.getElementById('addMaterialBtn').getAttribute('data-edit-index');

    if (currentEditIndex !== null) {
        const index = parseInt(currentEditIndex);
        materialData[index] = { name };
        document.getElementById('addMaterialBtn').textContent = '➕ 재료 추가';
        document.getElementById('addMaterialBtn').removeAttribute('data-edit-index');
    } else {
        materialData.push({ name });
    }

    saveMaterialData();
    clearMaterialForm();
    renderMaterialList();
    debouncedUpdate();
}

// 재료 수정/삭제 함수
function editMaterial(index) {
    const material = materialData[index];
    document.getElementById('materialName').value = material.name;
    document.getElementById('addMaterialBtn').textContent = '✏️ 재료 수정';
    document.getElementById('addMaterialBtn').setAttribute('data-edit-index', index);
    document.getElementById('materialName').scrollIntoView({ behavior: 'smooth' });
}

function deleteMaterial(index) {
    const material = materialData[index];
    if (!confirm(`정말 이 재료를 삭제하시겠습니까?\n\n${material.name}`)) {
        return;
    }

    updateCharacterDataAfterMaterialDeletion(index);
    materialData.splice(index, 1);
    saveMaterialData();
    renderMaterialList();
    debouncedUpdate();
}

function clearMaterialForm() {
    document.getElementById('materialName').value = '';
    const btn = document.getElementById('addMaterialBtn');
    btn.textContent = '➕ 재료 추가';
    btn.removeAttribute('data-edit-index');
}

// 재료 목록 렌더링
function renderMaterialList() {
    const materialList = document.getElementById('materialList');

    if (materialData.length === 0) {
        materialList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">등록된 재료가 없습니다</div>';
    } else {
        materialList.innerHTML = materialData.map((material, index) => `
            <div class="quest-item draggable-item" data-index="${index}">
                <div class="quest-info">
                    <span class="drag-handle" style="cursor: move; margin-right: 10px;">⋮⋮</span>
                    <span class="material-badge">재료</span>
                    <span><strong>${material.name}</strong></span>
                </div>
                <div class="quest-actions">
                    <button class="btn-small btn-edit" onclick="editMaterial(${index})" title="수정">✏️</button>
                    <button class="btn-small btn-delete" onclick="deleteMaterial(${index})" title="삭제">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    setTimeout(() => {
        enableDragAndDrop('#materialList', materialData, saveMaterialData, renderMaterialList)();
    }, 0);
}

function saveMaterialData() {
    try {
        localStorage.setItem('mabinogi_material_data', JSON.stringify(materialData));
        showSaveStatus();
        return true;
    } catch (error) {
        console.error('Material data save failed:', error);
        showSaveStatus(true);
        return false;
    }
}

function checkAccountDataReset() {
    const currentDaily = getCurrentLogicDate();
    const currentWeekly = getCurrentWeekStart();

    // 계정 일간 데이터 체크
    const lastAccountDaily = localStorage.getItem('mabinogi_account_daily_reset') || '';
    if (lastAccountDaily !== currentDaily) {
        console.log('계정 일간 데이터 초기화:', lastAccountDaily, '->', currentDaily);
        localStorage.removeItem('mabinogi_account_daily_quest');
        localStorage.removeItem('mabinogi_account_daily_questManagement');
        localStorage.setItem('mabinogi_account_daily_reset', currentDaily);
    }

    // 계정 주간 데이터 체크
    const lastAccountWeekly = localStorage.getItem('mabinogi_account_weekly_reset') || '';
    if (lastAccountWeekly !== currentWeekly) {
        console.log('계정 주간 데이터 초기화:', lastAccountWeekly, '->', currentWeekly);
        localStorage.removeItem('mabinogi_account_weekly_quest');
        localStorage.removeItem('mabinogi_account_weekly_questManagement');
        localStorage.setItem('mabinogi_account_weekly_reset', currentWeekly);
    }
}

// 물물교환 데이터 로드/저장
function loadQuestData() {
    const stored = localStorage.getItem('mabinogi_quest_data');
    if (stored) {
        try {
            const parsedData = JSON.parse(stored);
            if (Array.isArray(parsedData) && parsedData.every(quest =>
                quest.type && quest.location && quest.npc && quest.need && quest.reward)) {
                questData = parsedData;
            }
        } catch (error) {
            console.error('Failed to load quest data:', error);
            saveQuestData();
        }
    } else {
        saveQuestData();
    }
    return questData;
}

function saveQuestData() {
    try {
        localStorage.setItem('mabinogi_quest_data', JSON.stringify(questData));
        showSaveStatus();
        return true;
    } catch (error) {
        console.error('Quest data save failed:', error);
        showSaveStatus(true);
        return false;
    }
}

// 퀘스트 관리 데이터 로드/저장
function loadQuestManagementData() {
    const stored = localStorage.getItem('mabinogi_quest_management_data');
    if (stored) {
        try {
            const parsedData = JSON.parse(stored);
            if (Array.isArray(parsedData) && parsedData.every(quest =>
                quest.type && quest.name && quest.count)) {
                questManagementData = parsedData;
            }
        } catch (error) {
            console.error('Failed to load quest management data:', error);
            saveQuestManagementData();
        }
    } else {
        saveQuestManagementData();
    }
    return questManagementData;
}

function saveQuestManagementData() {
    try {
        localStorage.setItem('mabinogi_quest_management_data', JSON.stringify(questManagementData));
        showSaveStatus();
        return true;
    } catch (error) {
        console.error('Quest management data save failed:', error);
        showSaveStatus(true);
        return false;
    }
}

// 드래그 앤 드롭 기능
function enableDragAndDrop(containerSelector, dataArray, saveFunction, renderFunction) {
    let draggedElement = null;
    let draggedIndex = null;

    function setupDragEvents() {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const items = container.querySelectorAll('.draggable-item');

        items.forEach((item, index) => {
            item.draggable = true;
            item.style.cursor = 'move';

            item.addEventListener('dragstart', (e) => {
                draggedElement = item;
                draggedIndex = index;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                console.log(`드래그 시작: 인덱스 ${index}`);
            });

            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
                draggedElement = null;
                draggedIndex = null;
                console.log('드래그 종료');
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedElement && draggedElement !== item) {
                    const targetIndex = Array.from(items).indexOf(item);
                    console.log(`드롭: ${draggedIndex} -> ${targetIndex}`);
                    
                    // 데이터 타입 결정
                    let dataType;
                    if (containerSelector.includes('questList')) {
                        dataType = 'quest';
                    } else if (containerSelector.includes('questMgmtList')) {
                        dataType = 'questManagement';
                    } else if (containerSelector.includes('materialList')) {
                        dataType = 'material';
                    }
                    
                    // 캐릭터 데이터 인덱스 업데이트 (순서 변경 전에 실행)
                    if (dataType === 'material') {
                        updateCharacterDataIndicesAfterMaterialReorder(draggedIndex, targetIndex);
                    } else {
                        updateCharacterDataIndicesAfterReorder(draggedIndex, targetIndex, dataType);
                    }

                    // 배열 순서 변경
                    const movedItem = dataArray.splice(draggedIndex, 1)[0];
                    dataArray.splice(targetIndex, 0, movedItem);

                    // 저장 및 렌더링
                    saveFunction();
                    
                    setTimeout(() => {
                        renderFunction();
                        debouncedUpdate();
                    }, 50);
                }
            });
        });
    }

    return setupDragEvents;
}

function validateCharacterData(charId) {
    const data = loadCharacterData(charId);
    let hasChanges = false;
    
    // 물물교환 데이터 검증
    const validDailyChecks = {};
    const validWeeklyChecks = {};
    
    Object.entries(data.dailyChecks || {}).forEach(([key, value]) => {
        const idx = parseInt(key);
        if (idx >= 0 && idx < questData.length && questData[idx] && questData[idx].type === 'daily') {
            validDailyChecks[idx] = value;
        } else {
            hasChanges = true;
            console.log(`잘못된 일간 체크 데이터 제거: ${key}`);
        }
    });
    
    Object.entries(data.weeklyChecks || {}).forEach(([key, value]) => {
        const idx = parseInt(key);
        if (idx >= 0 && idx < questData.length && questData[idx] && questData[idx].type === 'weekly') {
            validWeeklyChecks[idx] = value;
        } else {
            hasChanges = true;
            console.log(`잘못된 주간 체크 데이터 제거: ${key}`);
        }
    });
    
    // 퀘스트 관리 데이터 검증
    const validDailyQuestMgmt = {};
    const validWeeklyQuestMgmt = {};
    
    Object.entries(data.dailyQuestMgmtChecks || {}).forEach(([key, value]) => {
        const idx = parseInt(key);
        if (idx >= 0 && idx < questManagementData.length && questManagementData[idx] && questManagementData[idx].type === 'daily') {
            validDailyQuestMgmt[idx] = value;
        } else {
            hasChanges = true;
            console.log(`잘못된 일간 퀘스트 관리 데이터 제거: ${key}`);
        }
    });
    
    Object.entries(data.weeklyQuestMgmtChecks || {}).forEach(([key, value]) => {
        const idx = parseInt(key);
        if (idx >= 0 && idx < questManagementData.length && questManagementData[idx] && questManagementData[idx].type === 'weekly') {
            validWeeklyQuestMgmt[idx] = value;
        } else {
            hasChanges = true;
            console.log(`잘못된 주간 퀘스트 관리 데이터 제거: ${key}`);
        }
    });
    
    if (hasChanges) {
        data.dailyChecks = validDailyChecks;
        data.weeklyChecks = validWeeklyChecks;
        data.dailyQuestMgmtChecks = validDailyQuestMgmt;
        data.weeklyQuestMgmtChecks = validWeeklyQuestMgmt;
        saveCharacterData(charId, data);
        console.log(`${charId} 데이터 무결성 복구 완료`);
    }
    
    return data;
}

function validateAllCharacterData() {
    const characters = getCharacterList();
    let totalFixed = 0;
    
    characters.forEach(char => {
        const beforeData = JSON.stringify(loadCharacterData(char.id));
        validateCharacterData(char.id);
        const afterData = JSON.stringify(loadCharacterData(char.id));
        
        if (beforeData !== afterData) {
            totalFixed++;
            console.log(`${char.name} 데이터 무결성 수정됨`);
        }
    });
    
    if (totalFixed > 0) {
        console.log(`총 ${totalFixed}개 캐릭터 데이터 수정됨`);
        // UI 업데이트
        setTimeout(() => {
            renderAllCharacters();
            updateStats();
        }, 100);
    }
    
    return totalFixed;
}

// 재료 순서 변경 시 캐릭터 데이터 인덱스 업데이트
function updateCharacterDataIndicesAfterMaterialReorder(oldIndex, newIndex) {
    console.log(`재료 순서 변경: ${oldIndex} -> ${newIndex}`);
    
    if (oldIndex === newIndex) return;
    
    const characters = getCharacterList();
    const totalLength = materialData.length;
    const isMovingDown = oldIndex < newIndex;
    
    characters.forEach(char => {
        const data = loadCharacterData(char.id);
        
        if (!data.materialCounts) return;
        
        const newMaterialCounts = {};
        
        Object.entries(data.materialCounts).forEach(([indexStr, value]) => {
            const currentIndex = parseInt(indexStr);
            let newMappedIndex = currentIndex;
            
            if (currentIndex === oldIndex) {
                newMappedIndex = newIndex;
            } else if (isMovingDown) {
                if (currentIndex > oldIndex && currentIndex <= newIndex) {
                    newMappedIndex = currentIndex - 1;
                }
            } else {
                if (currentIndex >= newIndex && currentIndex < oldIndex) {
                    newMappedIndex = currentIndex + 1;
                }
            }
            
            if (newMappedIndex >= 0 && newMappedIndex < totalLength) {
                newMaterialCounts[newMappedIndex] = value;
            }
        });
        
        data.materialCounts = newMaterialCounts;
        saveCharacterData(char.id, data);
    });
    
    console.log('재료 순서 변경 후 인덱스 업데이트 완료');
}

// 재료 삭제 시 캐릭터 데이터 업데이트
function updateCharacterDataAfterMaterialDeletion(deletedIndex) {
    const characters = getCharacterList();
    characters.forEach(char => {
        const data = loadCharacterData(char.id);
        
        if (data.materialCounts) {
            const newMaterialCounts = {};
            Object.keys(data.materialCounts).forEach(key => {
                const idx = parseInt(key);
                if (idx < deletedIndex) {
                    newMaterialCounts[idx] = data.materialCounts[key];
                } else if (idx > deletedIndex) {
                    newMaterialCounts[idx - 1] = data.materialCounts[key];
                }
            });
            data.materialCounts = newMaterialCounts;
            saveCharacterData(char.id, data);
        }
    });
}

// 순서 변경 시 캐릭터 데이터 인덱스 업데이트
function updateCharacterDataIndicesAfterReorder(oldIndex, newIndex, dataType) {
    console.log(`순서 변경: ${dataType}, ${oldIndex} -> ${newIndex}`);
    
    if (oldIndex === newIndex) return; // 같은 위치면 처리 안함
    
    const characters = getCharacterList();
    const totalLength = dataType === 'quest' ? questData.length : questManagementData.length;
    
    // 이동 방향 결정
    const isMovingDown = oldIndex < newIndex;
    
    // 데이터 타입에 따른 키 결정
    let dailyKey, weeklyKey, accountDailyKey, accountWeeklyKey;
    
    if (dataType === 'quest') {
        dailyKey = 'dailyChecks';
        weeklyKey = 'weeklyChecks';
        accountDailyKey = 'mabinogi_account_daily_quest';
        accountWeeklyKey = 'mabinogi_account_weekly_quest';
    } else {
        dailyKey = 'dailyQuestMgmtChecks';
        weeklyKey = 'weeklyQuestMgmtChecks';
        accountDailyKey = 'mabinogi_account_daily_questManagement';
        accountWeeklyKey = 'mabinogi_account_weekly_questManagement';
    }
    
    characters.forEach(char => {
        const data = loadCharacterData(char.id);
        
        // 각 체크 타입별로 처리
        [dailyKey, weeklyKey].forEach(key => {
            if (!data[key]) return;
            
            const newData = {};
            
            Object.entries(data[key]).forEach(([indexStr, value]) => {
                const currentIndex = parseInt(indexStr);
                let newMappedIndex = currentIndex;
                
                if (currentIndex === oldIndex) {
                    // 이동되는 아이템
                    newMappedIndex = newIndex;
                } else if (isMovingDown) {
                    // 아래로 이동: oldIndex+1 ~ newIndex 범위의 아이템들을 위로 한 칸
                    if (currentIndex > oldIndex && currentIndex <= newIndex) {
                        newMappedIndex = currentIndex - 1;
                    }
                } else {
                    // 위로 이동: newIndex ~ oldIndex-1 범위의 아이템들을 아래로 한 칸
                    if (currentIndex >= newIndex && currentIndex < oldIndex) {
                        newMappedIndex = currentIndex + 1;
                    }
                }
                
                // 유효한 범위 확인
                if (newMappedIndex >= 0 && newMappedIndex < totalLength) {
                    newData[newMappedIndex] = value;
                }
            });
            
            data[key] = newData;
        });
        
        saveCharacterData(char.id, data);
    });
    
    // 계정 데이터 처리
    [accountDailyKey, accountWeeklyKey].forEach(accountKey => {
        const accountData = JSON.parse(localStorage.getItem(accountKey) || '{}');
        const newAccountData = {};
        
        Object.entries(accountData).forEach(([indexStr, value]) => {
            const currentIndex = parseInt(indexStr);
            let newMappedIndex = currentIndex;
            
            if (currentIndex === oldIndex) {
                newMappedIndex = newIndex;
            } else if (isMovingDown) {
                if (currentIndex > oldIndex && currentIndex <= newIndex) {
                    newMappedIndex = currentIndex - 1;
                }
            } else {
                if (currentIndex >= newIndex && currentIndex < oldIndex) {
                    newMappedIndex = currentIndex + 1;
                }
            }
            
            if (newMappedIndex >= 0 && newMappedIndex < totalLength) {
                newAccountData[newMappedIndex] = value;
            }
        });
        
        localStorage.setItem(accountKey, JSON.stringify(newAccountData));
    });
    
    console.log('순서 변경 후 인덱스 업데이트 완료');
}

// 순서 변경 후 캐릭터 데이터 업데이트
function updateAllCharacterDataAfterReorder() {
    const characters = getCharacterList();

    setTimeout(() => {
        renderAllCharacters();
        updateFiltersAndUI();
    }, 0);
}

// 물물교환 퀘스트 추가
function addQuest() {
    const type = document.getElementById('questType').value;
    const location = document.getElementById('questLocation').value.trim();
    const npc = document.getElementById('questNpc').value.trim();
    const need = document.getElementById('questNeed').value.trim();
    const needCount = parseInt(document.getElementById('questNeedCount').value);
    const reward = document.getElementById('questReward').value.trim();
    const rewardCount = parseInt(document.getElementById('questRewardCount').value);

    if (!location || !npc || !need || !needCount || !reward || !rewardCount) {
        alert('모든 필드를 입력해주세요!');
        return;
    }

    if (needCount < 1 || rewardCount < 1) {
        alert('수량은 1 이상이어야 합니다!');
        return;
    }

    const currentEditIndex = document.getElementById('addQuestBtn').getAttribute('data-edit-index');

    if (currentEditIndex !== null) {
        const index = parseInt(currentEditIndex);
        questData[index] = { type, location, npc, need, needCount, reward, rewardCount };
        document.getElementById('addQuestBtn').textContent = '➕ 퀘스트 추가';
        document.getElementById('addQuestBtn').removeAttribute('data-edit-index');
    } else {
        questData.push({ type, location, npc, need, needCount, reward, rewardCount });
    }

    saveQuestData();
    clearQuestForm();
    renderQuestList();
    debouncedUpdate();
}

// 퀘스트 관리 추가
function addQuestManagement() {
    const type = document.getElementById('questMgmtType').value;
    const name = document.getElementById('questMgmtName').value.trim();
    const count = parseInt(document.getElementById('questMgmtCount').value);
    const category = document.getElementById('questMgmtCategory').value.trim();

    if (!name || !count || !category) {
        alert('모든 필드를 입력해주세요!');
        return;
    }

    if (count < 1) {
        alert('횟수는 1 이상이어야 합니다!');
        return;
    }

    const currentEditIndex = document.getElementById('addQuestMgmtBtn').getAttribute('data-edit-index');

    if (currentEditIndex !== null) {
        const index = parseInt(currentEditIndex);
        questManagementData[index] = { type, name, count, category };
        document.getElementById('addQuestMgmtBtn').textContent = '➕ 퀘스트 추가';
        document.getElementById('addQuestMgmtBtn').removeAttribute('data-edit-index');
    } else {
        questManagementData.push({ type, name, count, category });
    }

    saveQuestManagementData();
    clearQuestManagementForm();
    renderQuestManagementList();
    debouncedUpdate();
}

// 물물교환 퀘스트 수정
function editQuest(index) {
    const quest = questData[index];

    document.getElementById('questType').value = quest.type;
    document.getElementById('questLocation').value = quest.location;
    document.getElementById('questNpc').value = quest.npc;
    document.getElementById('questNeed').value = quest.need;
    document.getElementById('questNeedCount').value = quest.needCount;
    document.getElementById('questReward').value = quest.reward;
    document.getElementById('questRewardCount').value = quest.rewardCount;

    document.getElementById('addQuestBtn').textContent = '✏️ 퀘스트 수정';
    document.getElementById('addQuestBtn').setAttribute('data-edit-index', index);

    document.getElementById('questType').scrollIntoView({ behavior: 'smooth' });
}

// 퀘스트 관리 수정
function editQuestManagement(index) {
    const quest = questManagementData[index];

    document.getElementById('questMgmtType').value = quest.type;
    document.getElementById('questMgmtName').value = quest.name;
    document.getElementById('questMgmtCount').value = quest.count;
    document.getElementById('questMgmtCategory').value = quest.category;

    document.getElementById('addQuestMgmtBtn').textContent = '✏️ 퀘스트 수정';
    document.getElementById('addQuestMgmtBtn').setAttribute('data-edit-index', index);

    document.getElementById('questMgmtType').scrollIntoView({ behavior: 'smooth' });
}

// 물물교환 퀘스트 삭제
function deleteQuest(index) {
    const quest = questData[index];
    if (!quest) {
        console.error(`잘못된 퀘스트 인덱스: ${index}`);
        return;
    }
    
    if (!confirm(`정말 이 퀘스트를 삭제하시겠습니까?\n\n${quest.location} - ${quest.npc}: ${quest.need} ${quest.needCount}개`)) {
        return;
    }

    // 데이터 업데이트 전에 로깅
    console.log('퀘스트 삭제 시작:', index, quest.location);
    
    updateCharacterDataAfterDeletion(index, 'quest');
    questData.splice(index, 1);
    saveQuestData();
    renderQuestList();

    // 충분한 지연 후 UI 업데이트
    setTimeout(() => {
        renderAllCharacters();
        updateFiltersAndUI();
    }, 100);
}

// 퀘스트 관리 삭제
function deleteQuestManagement(index) {
    const quest = questManagementData[index];
    if (!quest) {
        console.error(`잘못된 퀘스트 관리 인덱스: ${index}`);
        return;
    }
    
    if (!confirm(`정말 이 퀘스트를 삭제하시겠습니까?\n\n${quest.name} (${quest.count}회)`)) {
        return;
    }

    // 데이터 업데이트 전에 로깅
    console.log('퀘스트 관리 삭제 시작:', index, quest.name);
    
    updateCharacterDataAfterDeletion(index, 'questManagement');
    questManagementData.splice(index, 1);
    saveQuestManagementData();
    renderQuestManagementList();

    // 충분한 지연 후 UI 업데이트
    setTimeout(() => {
        renderAllCharacters();
        updateFiltersAndUI();
    }, 100);
}

// 삭제 후 캐릭터 데이터 업데이트
function updateCharacterDataAfterDeletion(deletedIndex, dataType) {
    console.log(`삭제 시작: ${dataType}, 인덱스: ${deletedIndex}`);
    
    const characters = getCharacterList();
    // 삭제 후의 길이로 계산
    const totalLength = (dataType === 'quest' ? questData.length : questManagementData.length) - 1;
    
    // 삭제 전 데이터 백업 (디버깅용)
    const backupData = {};
    
    characters.forEach(char => {
        const data = loadCharacterData(char.id);
        
        // 백업 생성
        backupData[char.id] = JSON.parse(JSON.stringify(data));

        const dailyKey = dataType === 'quest' ? 'dailyChecks' : 'dailyQuestMgmtChecks';
        const weeklyKey = dataType === 'quest' ? 'weeklyChecks' : 'weeklyQuestMgmtChecks';

        // 새로운 체크 데이터 생성
        const newDailyChecks = {};
        const newWeeklyChecks = {};

        // dailyChecks 재구성
        Object.entries(data[dailyKey] || {}).forEach(([key, value]) => {
            const idx = parseInt(key);
            
            // 유효성 검사 추가
            if (isNaN(idx) || idx < 0) return;
            
            if (idx < deletedIndex) {
                // 삭제된 인덱스보다 작은 경우 그대로 유지
                newDailyChecks[idx] = value;
            } else if (idx > deletedIndex) {
                // 삭제된 인덱스보다 큰 경우 1씩 감소
                const newIdx = idx - 1;
                // 삭제 후 배열 길이로 검증
                if (newIdx >= 0 && newIdx <= totalLength) {
                    newDailyChecks[newIdx] = value;
                }
            }
        });

        // weeklyChecks 재구성
        Object.entries(data[weeklyKey] || {}).forEach(([key, value]) => {
            const idx = parseInt(key);
            
            if (isNaN(idx) || idx < 0) return;
            
            if (idx < deletedIndex) {
                newWeeklyChecks[idx] = value;
            } else if (idx > deletedIndex) {
                const newIdx = idx - 1;
                if (newIdx >= 0 && newIdx <= totalLength) {
                    newWeeklyChecks[newIdx] = value;
                }
            }
        });

        // 계정 데이터 처리
        const accountDailyKey = `mabinogi_account_daily_${dataType}`;
        const accountWeeklyKey = `mabinogi_account_weekly_${dataType}`;

        [accountDailyKey, accountWeeklyKey].forEach(accountKey => {
            const accountData = JSON.parse(localStorage.getItem(accountKey) || '{}');
            const newAccountData = {};

            Object.entries(accountData).forEach(([key, value]) => {
                const idx = parseInt(key);
                
                if (isNaN(idx) || idx < 0) return;
                
                if (idx < deletedIndex) {
                    newAccountData[idx] = value;
                } else if (idx > deletedIndex) {
                    const newIdx = idx - 1;
                    if (newIdx >= 0 && newIdx <= totalLength) {
                        newAccountData[newIdx] = value;
                    }
                }
            });

            localStorage.setItem(accountKey, JSON.stringify(newAccountData));
        });

        // 데이터 저장
        data[dailyKey] = newDailyChecks;
        data[weeklyKey] = newWeeklyChecks;
        saveCharacterData(char.id, data);
        
        console.log(`캐릭터 ${char.name} 데이터 업데이트 완료`);
    });
    
    console.log('삭제 후 데이터 업데이트 완료');
}

// 폼 초기화
function clearQuestForm() {
    document.getElementById('questType').value = 'daily';
    document.getElementById('questLocation').value = '';
    document.getElementById('questNpc').value = '';
    document.getElementById('questNeed').value = '';
    document.getElementById('questNeedCount').value = '';
    document.getElementById('questReward').value = '';
    document.getElementById('questRewardCount').value = '';

    const btn = document.getElementById('addQuestBtn');
    btn.textContent = '➕ 퀘스트 추가';
    btn.removeAttribute('data-edit-index');
}

function clearQuestManagementForm() {
    document.getElementById('questMgmtType').value = 'daily';
    document.getElementById('questMgmtName').value = '';
    document.getElementById('questMgmtCount').value = '';
    document.getElementById('questMgmtCategory').value = '';

    const btn = document.getElementById('addQuestMgmtBtn');
    btn.textContent = '➕ 퀘스트 추가';
    btn.removeAttribute('data-edit-index');
}

// 물물교환 퀘스트 목록 렌더링
function renderQuestList() {
    const questList = document.getElementById('questList');

    if (questData.length === 0) {
        questList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">등록된 퀘스트가 없습니다</div>';
    } else {
        questList.innerHTML = questData.map((quest, index) => {
            const badgeClass = quest.type === 'weekly' ? 'weekly-badge' :
                quest.type === 'accountDaily' ? 'account-daily-badge' :
                    quest.type === 'accountWeekly' ? 'account-weekly-badge' : 'daily-badge';
            const badgeText = quest.type === 'weekly' ? '주간' :
                quest.type === 'accountDaily' ? '계정일간' :
                    quest.type === 'accountWeekly' ? '계정주간' : '일간';

            return `
                <div class="quest-item draggable-item" data-index="${index}">
                    <div class="quest-info">
                        <span class="drag-handle" style="cursor: move; margin-right: 10px;">⋮⋮</span>
                        <span class="${badgeClass}">${badgeText}</span>
                        <span><strong>${quest.location}</strong> - ${quest.npc}</span>
                        <span>${quest.need} ${quest.needCount}개 → ${quest.reward} ${quest.rewardCount}개</span>
                    </div>
                    <div class="quest-actions">
                        <button class="btn-small btn-edit" onclick="editQuest(${index})" title="수정">✏️</button>
                        <button class="btn-small btn-delete" onclick="deleteQuest(${index})" title="삭제">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    setTimeout(() => {
        enableDragAndDrop('#questList', questData, saveQuestData, renderQuestList)();
    }, 0);
}

// 퀘스트 관리 목록 렌더링
function renderQuestManagementList() {
    const questMgmtList = document.getElementById('questMgmtList');

    if (questManagementData.length === 0) {
        questMgmtList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">등록된 퀘스트가 없습니다</div>';
    } else {
        questMgmtList.innerHTML = questManagementData.map((quest, index) => {
            const badgeClass = quest.type === 'weekly' ? 'weekly-badge' :
                quest.type === 'accountDaily' ? 'account-daily-badge' :
                    quest.type === 'accountWeekly' ? 'account-weekly-badge' : 'daily-badge';
            const badgeText = quest.type === 'weekly' ? '주간' :
                quest.type === 'accountDaily' ? '계정일간' :
                    quest.type === 'accountWeekly' ? '계정주간' : '일간';

            return `
                <div class="quest-item draggable-item" data-index="${index}">
                    <div class="quest-info">
                        <span class="drag-handle" style="cursor: move; margin-right: 10px;">⋮⋮</span>
                        <span class="${badgeClass}">${badgeText}</span>
                        <span><strong>${quest.category}</strong></span>
                        <span>${quest.name} ${quest.count}회</span>
                    </div>
                    <div class="quest-actions">
                        <button class="btn-small btn-edit" onclick="editQuestManagement(${index})" title="수정">✏️</button>
                        <button class="btn-small btn-delete" onclick="deleteQuestManagement(${index})" title="삭제">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    setTimeout(() => {
        enableDragAndDrop('#questMgmtList', questManagementData, saveQuestManagementData, renderQuestManagementList)();
    }, 0);
}

// 계정 공유 체크 상태 확인
function isAccountChecked(questIndex, dataType = 'quest') {
    const currentData = dataType === 'quest' ? questData : questManagementData;
    const quest = currentData[questIndex];

    if (!quest || (quest.type !== 'accountDaily' && quest.type !== 'accountWeekly')) return false;

    const timeType = quest.type === 'accountDaily' ? 'daily' : 'weekly';
    const accountKey = `mabinogi_account_${timeType}_${dataType}`;
    const stored = localStorage.getItem(accountKey);
    const accountData = stored ? JSON.parse(stored) : {};

    return accountData[questIndex] || false;
}

// 계정 공유 체크 상태 설정
function setAccountChecked(questIndex, checked, dataType = 'quest') {
    const currentData = dataType === 'quest' ? questData : questManagementData;
    const quest = currentData[questIndex];

    if (!quest || (quest.type !== 'accountDaily' && quest.type !== 'accountWeekly')) return;

    const timeType = quest.type === 'accountDaily' ? 'daily' : 'weekly';
    const accountKey = `mabinogi_account_${timeType}_${dataType}`;
    const stored = localStorage.getItem(accountKey);
    let accountData = stored ? JSON.parse(stored) : {};

    if (checked) {
        accountData[questIndex] = true;
    } else {
        delete accountData[questIndex];
    }

    // 저장 후 상태 확인 로그 추가 (디버깅용)
    localStorage.setItem(accountKey, JSON.stringify(accountData));
    console.log(`계정 데이터 저장: ${accountKey}`, accountData);

    // 모든 캐릭터의 UI 업데이트
    const characters = getCharacterList();
    characters.forEach(char => {
        document.querySelectorAll(`tr[data-char='${char.id}'][data-row='${questIndex}'][data-type='${dataType}']`).forEach(row => {
            const checkbox = row.querySelector('.checker');
            if (checkbox) {
                checkbox.checked = checked;
                row.classList.toggle('completed', checked);
            }
        });
        updateProgress(char.id);
    });
    
    // 통계 업데이트
    updateStats();
    
    // 필터가 적용된 상태라면 테이블을 다시 렌더링
    const currentTab = getCurrentTab();
    if (currentTab === 'allView') {
        const statusFilter = document.getElementById('statusFilter')?.value;
        if (statusFilter && statusFilter !== 'all') {
            setTimeout(() => {
                renderAllCharacters();
            }, 0);
        }
    }
}

// 현재 날짜 계산
function getCurrentLogicDate() {
    const now = new Date();
    const logicDate = new Date(now);
    if (now.getHours() < 6) {
        logicDate.setDate(now.getDate() - 1);
    }
    return logicDate.toISOString().slice(0, 10);
}

function getCurrentWeekStart() {
    const now = new Date();
    let current = new Date(now);

    if (now.getHours() < 6) {
        current.setDate(current.getDate() - 1);
    }

    const dayOfWeek = current.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(current);
    monday.setDate(current.getDate() + daysToMonday);
    monday.setHours(6, 0, 0, 0);

    if (now < monday) {
        monday.setDate(monday.getDate() - 7);
    }

    return monday.toISOString().slice(0, 10);
}

// 리셋 타이머 업데이트
function updateResetTimers() {
    const now = new Date();

    const nextDaily = new Date(now);
    nextDaily.setDate(now.getDate() + 1);
    nextDaily.setHours(6, 0, 0, 0);
    if (now.getHours() >= 6) {
        // 이미 오늘 6시 지났으면 내일 6시
    } else {
        nextDaily.setDate(now.getDate());
    }

    const nextWeekly = new Date(now);
    const currentDay = now.getDay();
    const daysUntilMonday = currentDay === 0 ? 1 : 8 - currentDay;
    nextWeekly.setDate(now.getDate() + daysUntilMonday);
    nextWeekly.setHours(6, 0, 0, 0);

    const thisWeekMonday = new Date(now);
    const daysToThisMonday = currentDay === 0 ? -6 : 1 - currentDay;
    thisWeekMonday.setDate(now.getDate() + daysToThisMonday);
    thisWeekMonday.setHours(6, 0, 0, 0);

    if (now < thisWeekMonday) {
        nextWeekly.setTime(thisWeekMonday.getTime());
    }

    const dailyDiff = nextDaily - now;
    const weeklyDiff = nextWeekly - now;

    function formatTime(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function formatDaysTime(ms) {
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${days}일 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    document.getElementById('dailyTimer').textContent = formatTime(dailyDiff);
    document.getElementById('weeklyTimer').textContent = formatDaysTime(weeklyDiff);
}

// 브라우저 제목 업데이트
function updatePageTitle() {
    const characters = getCharacterList();
    let totalIncomplete = 0;

    characters.forEach(char => {
        const data = loadCharacterData(char.id);

        const tradeIncomplete = questData.length - (Object.keys(data.dailyChecks || {}).length + Object.keys(data.weeklyChecks || {}).length);

        let questMgmtIncomplete = 0;
        questManagementData.forEach((quest, index) => {
            const completedCount = getQuestMgmtCompletedCount(char.id, index);
            questMgmtIncomplete += quest.count - completedCount;
        });

        totalIncomplete += tradeIncomplete + questMgmtIncomplete;
    });

    const baseTitle = '모비 췍';
    //document.getElementById('pageTitle').textContent = totalIncomplete > 0 ? `(${totalIncomplete}) ${baseTitle}` : baseTitle; //미완료 개수
}

// 캐릭터 목록 관리
function getCharacterList() {
    const stored = localStorage.getItem('mabinogi_characters');
    return stored ? JSON.parse(stored) : [];
}

function saveCharacterList(characters) {
    localStorage.setItem('mabinogi_characters', JSON.stringify(characters));
    showSaveStatus();
}

function generateCharacterId() {
    return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 저장 상태 표시
function showSaveStatus(isError = false) {
    const status = document.getElementById('saveStatus');
    status.className = 'save-status show' + (isError ? ' error' : '');
    status.textContent = isError ? '저장 실패!' : '저장됨';

    setTimeout(() => {
        status.classList.remove('show');
    }, 2000);
}

// 데이터 내보내기
function exportData() {
    try {
        const characters = getCharacterList();
        const allData = {
            characters: characters,
            characterData: {},
            questData: questData,
            questManagementData: questManagementData,
            // 계정 데이터 추가
            accountData: {
                dailyQuest: JSON.parse(localStorage.getItem('mabinogi_account_daily_quest') || '{}'),
                weeklyQuest: JSON.parse(localStorage.getItem('mabinogi_account_weekly_quest') || '{}'),
                dailyQuestManagement: JSON.parse(localStorage.getItem('mabinogi_account_daily_questManagement') || '{}'),
                weeklyQuestManagement: JSON.parse(localStorage.getItem('mabinogi_account_weekly_questManagement') || '{}'),
                dailyReset: localStorage.getItem('mabinogi_account_daily_reset') || '',
                weeklyReset: localStorage.getItem('mabinogi_account_weekly_reset') || ''
            }
        };

        characters.forEach(char => {
            allData.characterData[char.id] = JSON.parse(localStorage.getItem(`mabinogi_${char.id}`) || '{}');
        });

        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `mabinogi_checklist_backup_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();

        showSaveStatus();
    } catch (error) {
        console.error('Export failed:', error);
        showSaveStatus(true);
    }
}

// 데이터 가져오기
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedData = JSON.parse(e.target.result);

            if (!importedData.characters || !importedData.characterData) {
                throw new Error('Invalid data format');
            }

            if (!confirm('기존 데이터를 모두 지우고 가져온 데이터로 교체하시겠습니까?')) {
                return;
            }

            // 기존 캐릭터 데이터 삭제
            const existingChars = getCharacterList();
            existingChars.forEach(char => {
                localStorage.removeItem(`mabinogi_${char.id}`);
            });

            // 기존 계정 데이터 삭제
            localStorage.removeItem('mabinogi_account_daily_quest');
            localStorage.removeItem('mabinogi_account_weekly_quest');
            localStorage.removeItem('mabinogi_account_daily_questManagement');
            localStorage.removeItem('mabinogi_account_weekly_questManagement');
            localStorage.removeItem('mabinogi_account_daily_reset');
            localStorage.removeItem('mabinogi_account_weekly_reset');

            // 새 데이터 복원
            saveCharacterList(importedData.characters);
            Object.keys(importedData.characterData).forEach(charId => {
                localStorage.setItem(`mabinogi_${charId}`, JSON.stringify(importedData.characterData[charId]));
            });

            if (importedData.questData) {
                questData = importedData.questData;
                saveQuestData();
            }

            if (importedData.questManagementData) {
                questManagementData = importedData.questManagementData;
                saveQuestManagementData();
            }

            // 계정 데이터 복원
            if (importedData.accountData) {
                localStorage.setItem('mabinogi_account_daily_quest', JSON.stringify(importedData.accountData.dailyQuest || {}));
                localStorage.setItem('mabinogi_account_weekly_quest', JSON.stringify(importedData.accountData.weeklyQuest || {}));
                localStorage.setItem('mabinogi_account_daily_questManagement', JSON.stringify(importedData.accountData.dailyQuestManagement || {}));
                localStorage.setItem('mabinogi_account_weekly_questManagement', JSON.stringify(importedData.accountData.weeklyQuestManagement || {}));
                
                if (importedData.accountData.dailyReset) {
                    localStorage.setItem('mabinogi_account_daily_reset', importedData.accountData.dailyReset);
                }
                if (importedData.accountData.weeklyReset) {
                    localStorage.setItem('mabinogi_account_weekly_reset', importedData.accountData.weeklyReset);
                }
            }

            renderTabs();
            renderAllCharacters();
            renderQuestList();
            renderQuestManagementList();
            updateStats();
            switchToTab('allView');

            showSaveStatus();

        } catch (error) {
            console.error('Import failed:', error);
            alert('파일을 가져오는데 실패했습니다. 올바른 백업 파일인지 확인해주세요.');
            showSaveStatus(true);
        }
    };
    reader.readAsText(file);

    event.target.value = '';
}

// 계정 퀘스트 초기화 함수 추가
function resetAccountQuests() {
    if (!confirm('정말 모든 계정 퀘스트의 진행상황을 초기화하시겠습니까?\n모든 캐릭터에 적용됩니다.')) return;

    // 계정 퀘스트 데이터 모두 삭제
    localStorage.removeItem('mabinogi_account_daily_quest');
    localStorage.removeItem('mabinogi_account_weekly_quest');
    localStorage.removeItem('mabinogi_account_daily_questManagement');
    localStorage.removeItem('mabinogi_account_weekly_questManagement');

    // 모든 캐릭터의 계정 퀘스트 UI 업데이트
    const characters = getCharacterList();
    characters.forEach(char => {
        document.querySelectorAll(`tr[data-char='${char.id}']`).forEach(row => {
            const rowIndex = parseInt(row.getAttribute('data-row'));
            const dataType = row.getAttribute('data-type') || 'quest';
            const currentData = dataType === 'quest' ? questData : questManagementData;
            
            if (currentData[rowIndex] && 
                (currentData[rowIndex].type === 'accountDaily' || currentData[rowIndex].type === 'accountWeekly')) {
                
                const checkbox = row.querySelector('.checker');
                if (checkbox) {
                    checkbox.checked = false;
                    row.classList.remove('completed');
                }

                // 퀘스트 관리의 경우 개별 체크박스도 초기화
                if (dataType === 'questManagement') {
                    const individualCheckboxes = row.querySelectorAll('.individual-checker');
                    individualCheckboxes.forEach(checkbox => {
                        checkbox.checked = false;
                    });

                    const quest = questManagementData[rowIndex];
                    if (quest) {
                        const progressSpan = row.querySelector('td:nth-child(4) span');
                        if (progressSpan) {
                            progressSpan.textContent = `0/${quest.count}`;
                        }
                    }
                }
            }
        });
        updateProgress(char.id);
    });

    updateStats();
    showSaveStatus();
}

function addAccountResetButton() {
    const topControls = document.querySelector('.top-controls .character-management');
    if (topControls && !document.getElementById('accountResetBtn')) {
        const resetBtn = document.createElement('button');
        resetBtn.id = 'accountResetBtn';
        resetBtn.className = 'btn btn-secondary';
        resetBtn.innerHTML = '🔄 계정퀘스트 초기화';
        resetBtn.onclick = resetAccountQuests;
        resetBtn.title = '모든 계정 퀘스트 초기화';
        topControls.appendChild(resetBtn);

        // 스크린샷 버튼 추가
        const screenshotBtn = document.createElement('button');
        screenshotBtn.id = 'screenshotBtn';
        screenshotBtn.className = 'btn btn-secondary';
        screenshotBtn.innerHTML = '📸 스크린샷';
        screenshotBtn.onclick = takeScreenshot;
        screenshotBtn.title = '전체화면 스크린샷';
        topControls.appendChild(screenshotBtn);
    }
}

// 필터 초기화
function initializeFilters() {
    const locations = [...new Set(questData.map(q => q.location))];
    const locationFilter = document.getElementById('locationFilter');

    locationFilter.innerHTML = '<option value="all">전체</option>';
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });
}

function updateFiltersAndUI() {
    initializeFilters();
    applyFilters();
    updateStats();
    updatePageTitle();
}

// 필터 적용
function applyFilters() {
    const currentTab = getCurrentTab();
    if (currentTab === 'allView') {
        renderAllCharacters();
    }
}

// 퀘스트 관리에서 개별 횟수 체크 상태 확인
function isQuestMgmtChecked(charId, questIndex, countIndex) {
    if (questIndex >= questManagementData.length || questIndex < 0) {
        return false;
    }

    const quest = questManagementData[questIndex];
    if (!quest) return false;

    // 계정 퀘스트인 경우 계정 데이터에서 확인
    if (quest.type === 'accountDaily' || quest.type === 'accountWeekly') {
        const timeType = quest.type === 'accountDaily' ? 'daily' : 'weekly';
        const accountKey = `mabinogi_account_${timeType}_questManagement`;
        const accountData = JSON.parse(localStorage.getItem(accountKey) || '{}');
        const questChecks = accountData[questIndex];

        if (!questChecks || !Array.isArray(questChecks)) {
            return false;
        }
        return questChecks[countIndex] || false;
    }

    // 일반 캐릭터별 퀘스트
    const data = loadCharacterData(charId);
    const checksKey = quest.type === 'weekly' ? 'weeklyQuestMgmtChecks' : 'dailyQuestMgmtChecks';
    const questChecks = data[checksKey] && data[checksKey][questIndex];

    if (!questChecks || !Array.isArray(questChecks)) {
        return false;
    }

    return questChecks[countIndex] || false;
}

function setQuestMgmtChecked(charId, questIndex, countIndex, checked) {
    if (questIndex >= questManagementData.length || questIndex < 0) {
        return;
    }

    const quest = questManagementData[questIndex];
    if (!quest) return;

    // 계정 퀘스트인 경우 계정 데이터에 저장
    if (quest.type === 'accountDaily' || quest.type === 'accountWeekly') {
        const timeType = quest.type === 'accountDaily' ? 'daily' : 'weekly';
        const accountKey = `mabinogi_account_${timeType}_questManagement`;
        const accountData = JSON.parse(localStorage.getItem(accountKey) || '{}');

        if (!accountData[questIndex]) {
            accountData[questIndex] = new Array(quest.count).fill(false);
        }

        accountData[questIndex][countIndex] = checked;
        
        // 저장 및 로그 추가
        localStorage.setItem(accountKey, JSON.stringify(accountData));
        console.log(`계정 퀘스트 관리 데이터 저장: ${accountKey}`, accountData);

        // 모든 캐릭터의 UI 업데이트
        const characters = getCharacterList();
        characters.forEach(char => {
            document.querySelectorAll(`tr[data-char='${char.id}'][data-row='${questIndex}'][data-type='questManagement']`).forEach(row => {
                const individualCheckboxes = row.querySelectorAll('.individual-checker');
                if (individualCheckboxes[countIndex]) {
                    individualCheckboxes[countIndex].checked = checked;
                }

                const completedCount = getQuestMgmtCompletedCount(char.id, questIndex);
                const allCompleted = completedCount === quest.count;

                const mainCheckbox = row.querySelector('.checker');
                if (mainCheckbox) {
                    mainCheckbox.checked = allCompleted;
                    row.classList.toggle('completed', allCompleted);
                }

                const progressSpan = row.querySelector('td:nth-child(4) span');
                if (progressSpan) {
                    progressSpan.textContent = `${completedCount}/${quest.count}`;
                }
            });
            updateProgress(char.id);
        });
        
        // 통계 업데이트
        updateStats();
        
        // 필터가 적용된 상태라면 테이블을 다시 렌더링
        const currentTab = getCurrentTab();
        if (currentTab === 'allView') {
            const statusFilter = document.getElementById('statusFilter')?.value;
            if (statusFilter && statusFilter !== 'all') {
                setTimeout(() => {
                    renderAllCharacters();
                }, 0);
            }
        }
        return;
    }

    // 일반 캐릭터별 퀘스트
    const data = loadCharacterData(charId);
    const checksKey = quest.type === 'weekly' ? 'weeklyQuestMgmtChecks' : 'dailyQuestMgmtChecks';

    if (!data[checksKey]) {
        data[checksKey] = {};
    }

    if (!data[checksKey][questIndex]) {
        data[checksKey][questIndex] = new Array(quest.count).fill(false);
    }

    data[checksKey][questIndex][countIndex] = checked;
    saveCharacterData(charId, data);
}

function getQuestMgmtCompletedCount(charId, questIndex) {
    if (questIndex >= questManagementData.length || questIndex < 0) {
        return 0;
    }

    const quest = questManagementData[questIndex];
    if (!quest) return 0;

    // 계정 퀘스트인 경우 계정 데이터에서 확인
    if (quest.type === 'accountDaily' || quest.type === 'accountWeekly') {
        const timeType = quest.type === 'accountDaily' ? 'daily' : 'weekly';
        const accountKey = `mabinogi_account_${timeType}_questManagement`;
        const accountData = JSON.parse(localStorage.getItem(accountKey) || '{}');
        const questChecks = accountData[questIndex];

        if (!questChecks || !Array.isArray(questChecks)) {
            return 0;
        }
        return questChecks.filter(check => check === true).length;
    }

    // 일반 캐릭터별 퀘스트
    const data = loadCharacterData(charId);
    const checksKey = quest.type === 'weekly' ? 'weeklyQuestMgmtChecks' : 'dailyQuestMgmtChecks';
    const questChecks = data[checksKey] && data[checksKey][questIndex];

    if (!questChecks || !Array.isArray(questChecks)) {
        return 0;
    }

    return questChecks.filter(check => check === true).length;
}

// 통계 업데이트
function updateStats() {
    const characters = getCharacterList();
    let totalCompleted = 0;
    let totalQuests = 0;
    let dailyCompleted = 0;
    let dailyTotal = 0;
    let weeklyCompleted = 0;
    let weeklyTotal = 0;

    const tradeQuestCount = questData.length;
    const tradeDailyCount = questData.filter(q => q.type === 'daily').length;
    const tradeWeeklyCount = questData.filter(q => q.type === 'weekly').length;
    const questMgmtTotalCount = questManagementData.reduce((sum, quest) => sum + quest.count, 0);
    const questMgmtDailyCount = questManagementData.filter(q => q.type === 'daily').reduce((sum, quest) => sum + quest.count, 0);
    const questMgmtWeeklyCount = questManagementData.filter(q => q.type === 'weekly').reduce((sum, quest) => sum + quest.count, 0);

    const tradeAccountDailyCount = questData.filter(q => q.type === 'accountDaily').length;
    const tradeAccountWeeklyCount = questData.filter(q => q.type === 'accountWeekly').length;
    const questMgmtAccountDailyCount = questManagementData.filter(q => q.type === 'accountDaily').reduce((sum, quest) => sum + quest.count, 0);
    const questMgmtAccountWeeklyCount = questManagementData.filter(q => q.type === 'accountWeekly').reduce((sum, quest) => sum + quest.count, 0);

    // 계정 퀘스트는 한 번만 계산
    const accountDailyCompleted = getAccountCompletedCount('daily');
    const accountWeeklyCompleted = getAccountCompletedCount('weekly');

    const totalQuestCount = tradeQuestCount + questMgmtTotalCount;
    const dailyQuestCount = tradeDailyCount + questMgmtDailyCount + tradeAccountDailyCount + questMgmtAccountDailyCount;
    const weeklyQuestCount = tradeWeeklyCount + questMgmtWeeklyCount + tradeAccountWeeklyCount + questMgmtAccountWeeklyCount;

    // 캐릭터별 퀘스트만 루프에서 계산
    characters.forEach(char => {
        const data = cleanupCharacterData(char.id);

        const tradeDaily = Object.keys(data.dailyChecks || {}).length;
        const tradeWeekly = Object.keys(data.weeklyChecks || {}).length;

        let questMgmtDaily = 0;
        let questMgmtWeekly = 0;

        questManagementData.forEach((quest, index) => {
            const completedCount = getQuestMgmtCompletedCount(char.id, index);
            if (quest.type === 'daily') {
                questMgmtDaily += completedCount;
            } else if (quest.type === 'weekly') {
                questMgmtWeekly += completedCount;
            }
        });

        const totalCharCompleted = tradeDaily + tradeWeekly + questMgmtDaily + questMgmtWeekly;

        totalCompleted += totalCharCompleted;
        totalQuests += totalQuestCount;

        dailyCompleted += tradeDaily + questMgmtDaily;
        dailyTotal += dailyQuestCount;

        weeklyCompleted += tradeWeekly + questMgmtWeekly;
        weeklyTotal += weeklyQuestCount;
    });

    // 계정 퀘스트는 루프 밖에서 한 번만 추가
    totalCompleted += accountDailyCompleted + accountWeeklyCompleted;
    dailyCompleted += accountDailyCompleted;
    weeklyCompleted += accountWeeklyCompleted;

    const totalPercent = totalQuests > 0 ? Math.round((totalCompleted / totalQuests) * 100) : 0;
    const dailyPercent = dailyTotal > 0 ? Math.round((dailyCompleted / dailyTotal) * 100) : 0;
    const weeklyPercent = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;

    document.getElementById('totalCompletion').textContent = `${totalPercent}%`;
    document.getElementById('dailyCompletion').textContent = `${dailyPercent}%`;
    document.getElementById('weeklyCompletion').textContent = `${weeklyPercent}%`;
    document.getElementById('activeCharacters').textContent = characters.length;
}

function getAccountCompletedCount(timeType) {
    let completed = 0;

    // 계정 물물교환
    const accountTradeKey = `mabinogi_account_${timeType}_quest`;
    const accountTradeData = JSON.parse(localStorage.getItem(accountTradeKey) || '{}');
    completed += Object.keys(accountTradeData).length;

    // 계정 퀘스트 관리
    const accountQuestKey = `mabinogi_account_${timeType}_questManagement`;
    const accountQuestData = JSON.parse(localStorage.getItem(accountQuestKey) || '{}');
    Object.values(accountQuestData).forEach(questChecks => {
        if (Array.isArray(questChecks)) {
            completed += questChecks.filter(check => check === true).length;
        }
    });

    return completed;
}

// 캐릭터 추가
function addCharacter() {
    const nameInput = document.getElementById('newCharName');
    const name = nameInput.value.trim();

    if (!name) {
        alert('캐릭터명을 입력해주세요!');
        return;
    }

    const characters = getCharacterList();
    if (characters.some(char => char.name === name)) {
        alert('이미 존재하는 캐릭터명입니다!');
        return;
    }

    const newChar = {
        id: generateCharacterId(),
        name: name
    };

    characters.push(newChar);
    saveCharacterList(characters);
    nameInput.value = '';

    renderTabs();
    renderAllCharacters();
    updateStats();
    updatePageTitle();
}

// 캐릭터 삭제
function deleteCharacter(charId) {
    if (!confirm('정말 이 캐릭터를 삭제하시겠습니까?\n모든 진행 데이터가 함께 삭제됩니다.')) {
        return;
    }

    const characters = getCharacterList();
    const filtered = characters.filter(char => char.id !== charId);
    saveCharacterList(filtered);

    localStorage.removeItem(`mabinogi_${charId}`);

    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab && activeTab.getAttribute('data-target') === `#char_${charId}`) {
        switchToTab('allView');
        saveCurrentTab('allView');
    }

    renderTabs();
    renderAllCharacters();
    updateStats();
    updatePageTitle();
}

// 캐릭터명 수정
function editCharacterName(charId, currentName) {
    const newName = prompt('새 캐릭터명을 입력하세요:', currentName);
    if (!newName || newName.trim() === '' || newName === currentName) {
        return;
    }

    const trimmedName = newName.trim();
    const characters = getCharacterList();

    if (characters.some(char => char.name === trimmedName && char.id !== charId)) {
        alert('이미 존재하는 캐릭터명입니다!');
        return;
    }

    const char = characters.find(c => c.id === charId);
    if (char) {
        char.name = trimmedName;
        saveCharacterList(characters);

        renderTabs();
        renderAllCharacters();

        const currentTab = getCurrentTab();
        switchToTab(currentTab);
    }
}

// 데이터 로드 및 자동 초기화
function loadCharacterData(charId) {
    const key = `mabinogi_${charId}`;
    const stored = localStorage.getItem(key);
    const currentDaily = getCurrentLogicDate();
    const currentWeekly = getCurrentWeekStart();

    let data = {
        lastDailyReset: currentDaily,
        lastWeeklyReset: currentWeekly,
        dailyChecks: {},
        weeklyChecks: {},
        dailyQuestMgmtChecks: {},
        weeklyQuestMgmtChecks: {},
        accountChecks: {},
        accountQuestMgmtChecks: {},
        characterMemo: ''
    };

    if (stored) {
        const parsed = JSON.parse(stored);
        data = { ...data, ...parsed };

        if (data.lastDailyReset !== currentDaily) {
            data.dailyChecks = {};
            data.dailyQuestMgmtChecks = {};
            data.lastDailyReset = currentDaily;
        }

        if (data.lastWeeklyReset !== currentWeekly) {
            data.weeklyChecks = {};
            data.weeklyQuestMgmtChecks = {};
            data.lastWeeklyReset = currentWeekly;
        }
    }

    localStorage.setItem(key, JSON.stringify(data));
    return data;
}

// 데이터 저장
function saveCharacterData(charId, data) {
    try {
        const key = `mabinogi_${charId}`;
        localStorage.setItem(key, JSON.stringify(data));
        showSaveStatus();
    } catch (error) {
        console.error('Save failed:', error);
        showSaveStatus(true);
    }
}

// 체크 상태 확인 (물물교환용)
function isChecked(charId, rowIndex, dataType = 'quest') {
    const totalQuestDataLength = dataType === 'quest' ? questData.length : questManagementData.length;

    if (rowIndex >= totalQuestDataLength || rowIndex < 0) {
        return false;
    }

    const currentData = dataType === 'quest' ? questData : questManagementData;
    const item = currentData[rowIndex];

    if (!item) return false;

    // 계정 퀘스트 체크 - 물물교환
    if (dataType === 'quest' && (item.type === 'accountDaily' || item.type === 'accountWeekly')) {
        return isAccountChecked(rowIndex, dataType);
    }

    // 계정 퀘스트 체크 - 퀘스트 관리 (전체 완료 여부)
    if (dataType === 'questManagement' && (item.type === 'accountDaily' || item.type === 'accountWeekly')) {
        const completedCount = getQuestMgmtCompletedCount(charId, rowIndex);
        return completedCount === item.count;
    }

    // 일반 퀘스트
    if (dataType === 'quest') {
        const data = loadCharacterData(charId);
        return item.type === 'weekly' ? data.weeklyChecks[rowIndex] : data.dailyChecks[rowIndex];
    } else {
        const data = loadCharacterData(charId);
        const checksKey = item.type === 'weekly' ? 'weeklyQuestMgmtChecks' : 'dailyQuestMgmtChecks';
        const questChecks = data[checksKey] && data[checksKey][rowIndex];

        if (!questChecks || !Array.isArray(questChecks)) {
            return false;
        }

        return questChecks.every(check => check === true);
    }
}

function setChecked(charId, rowIndex, checked, dataType = 'quest') {
    const totalQuestDataLength = dataType === 'quest' ? questData.length : questManagementData.length;

    if (rowIndex >= totalQuestDataLength || rowIndex < 0) {
        return;
    }

    const currentData = dataType === 'quest' ? questData : questManagementData;
    const item = currentData[rowIndex];

    if (!item) return;

    // 계정 퀘스트 처리 - 물물교환
    if (dataType === 'quest' && (item.type === 'accountDaily' || item.type === 'accountWeekly')) {
        setAccountChecked(rowIndex, checked, dataType);
        return;
    }

    // 계정 퀘스트 처리 - 퀘스트 관리
    if (dataType === 'questManagement' && (item.type === 'accountDaily' || item.type === 'accountWeekly')) {
        const timeType = item.type === 'accountDaily' ? 'daily' : 'weekly';
        const accountKey = `mabinogi_account_${timeType}_questManagement`;
        const accountData = JSON.parse(localStorage.getItem(accountKey) || '{}');

        if (!accountData[rowIndex]) {
            accountData[rowIndex] = new Array(item.count).fill(false);
        }

        // 전체 체크/체크해제
        accountData[rowIndex] = new Array(item.count).fill(checked);
        localStorage.setItem(accountKey, JSON.stringify(accountData));
        console.log(`계정 퀘스트 관리 전체 설정: ${accountKey}`, accountData);

        // 모든 캐릭터 UI 업데이트
        const characters = getCharacterList();
        characters.forEach(char => {
            document.querySelectorAll(`tr[data-char='${char.id}'][data-row='${rowIndex}'][data-type='questManagement']`).forEach(row => {
                const individualCheckboxes = row.querySelectorAll('.individual-checker');
                individualCheckboxes.forEach(checkbox => {
                    checkbox.checked = checked;
                });

                const mainCheckbox = row.querySelector('.checker');
                if (mainCheckbox) {
                    mainCheckbox.checked = checked;
                    row.classList.toggle('completed', checked);
                }

                const progressSpan = row.querySelector('td:nth-child(4) span');
                if (progressSpan) {
                    const count = checked ? item.count : 0;
                    progressSpan.textContent = `${count}/${item.count}`;
                }
            });
            updateProgress(char.id);
        });

        updateStats();
        return;
    }

    // 일반 퀘스트 처리
    const data = loadCharacterData(charId);

    if (dataType === 'quest') {
        if (item.type === 'weekly') {
            if (checked) {
                data.weeklyChecks[rowIndex] = true;
            } else {
                delete data.weeklyChecks[rowIndex];
            }
        } else {
            if (checked) {
                data.dailyChecks[rowIndex] = true;
            } else {
                delete data.dailyChecks[rowIndex];
            }
        }
    } else {
        const checksKey = item.type === 'weekly' ? 'weeklyQuestMgmtChecks' : 'dailyQuestMgmtChecks';

        if (!data[checksKey]) {
            data[checksKey] = {};
        }

        if (checked) {
            data[checksKey][rowIndex] = new Array(item.count).fill(true);
        } else {
            data[checksKey][rowIndex] = new Array(item.count).fill(false);
        }
    }

    saveCharacterData(charId, data);
}

// 캐릭터 메모 저장
function saveCharacterMemo(charId, memo) {
    const data = loadCharacterData(charId);
    if (memo.trim()) {
        data.characterMemo = memo.trim();
    } else {
        delete data.characterMemo;
    }
    saveCharacterData(charId, data);
}

// 진행률 업데이트
function updateProgress(charId) {
    const data = cleanupCharacterData(charId);

    // 캐릭터별 물물교환 (계정 퀘스트 제외)
    let tradeCompleted = 0;
    Object.keys(data.dailyChecks || {}).forEach(key => {
        const idx = parseInt(key);
        if (questData[idx] && questData[idx].type !== 'accountDaily' && questData[idx].type !== 'accountWeekly') {
            tradeCompleted++;
        }
    });
    Object.keys(data.weeklyChecks || {}).forEach(key => {
        const idx = parseInt(key);
        if (questData[idx] && questData[idx].type !== 'accountDaily' && questData[idx].type !== 'accountWeekly') {
            tradeCompleted++;
        }
    });

    let questMgmtCompleted = 0;
    questManagementData.forEach((quest, index) => {
        // 계정 퀘스트가 아닌 경우만 개별 캐릭터 진행률에 포함
        if (quest.type !== 'accountDaily' && quest.type !== 'accountWeekly') {
            questMgmtCompleted += getQuestMgmtCompletedCount(charId, index);
        }
    });

    // 물물교환도 마찬가지로 계정 퀘스트 제외
    const nonAccountTradeQuests = questData.filter(q => q.type !== 'accountDaily' && q.type !== 'accountWeekly').length;
    const nonAccountQuestMgmtCount = questManagementData
        .filter(q => q.type !== 'accountDaily' && q.type !== 'accountWeekly')
        .reduce((sum, quest) => sum + quest.count, 0);
    
    const totalQuests = nonAccountTradeQuests + nonAccountQuestMgmtCount;
    const completed = tradeCompleted + questMgmtCompleted;
    const percentage = totalQuests > 0 ? Math.round((completed / totalQuests) * 100) : 0;

    const progressTextAll = document.getElementById(`progress-all-${charId}`);
    const progressBarAll = document.getElementById(`bar-all-${charId}`);

    if (progressTextAll) progressTextAll.textContent = `${completed}/${totalQuests} (${percentage}%)`;
    if (progressBarAll) progressBarAll.style.width = `${percentage}%`;

    const progressText = document.getElementById(`progress-${charId}`);
    const progressBar = document.getElementById(`bar-${charId}`);

    if (progressText) progressText.textContent = `${completed}/${totalQuests} (${percentage}%)`;
    if (progressBar) progressBar.style.width = `${percentage}%`;

    updateStats();
    updatePageTitle();
}

// 퀘스트 테이블 생성
function createQuestTable(charId, isOverview = false) {
    const materialSection = `
        <div>
            <h4 style="margin: 15px 0 10px 0; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 5px;">🧰 보유 재료</h4>
            ${createMaterialSection(charId)}
        </div>
    `;

    const tradeSection = `
        <div style="margin-bottom: 20px;">
            <h4 style="margin: 15px 0 10px 0; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 5px;">📦 물물교환</h4>
            ${createSingleQuestTable(charId, questData, 'quest', isOverview)}
        </div>
    `;

    const questSection = `
        <div style="margin-bottom: 20px;">
            <h4 style="margin: 15px 0 10px 0; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 5px;">⚔️ 퀘스트</h4>
            ${createSingleQuestTable(charId, questManagementData, 'questManagement', isOverview)}
        </div>
    `;

    return materialSection + tradeSection + questSection;
}

function createMaterialSection(charId) {
    if (materialData.length === 0) {
        return '<div style="text-align: center; padding: 20px; color: var(--text-secondary);">등록된 재료가 없습니다</div>';
    }

    const materialItems = materialData.map((material, index) => {
        const currentCount = getMaterialCount(charId, index);
        return `
            <div class="material-item" data-char="${charId}" data-material="${index}">
                <span class="material-item-name">${material.name}</span>
                <div class="material-input-container">
                    <input 
                        type="number" 
                        class="material-count-input" 
                        data-char="${charId}" 
                        data-material="${index}"
                        value="${currentCount}" 
                        min="0" 
                        max="99999"
                        placeholder="0"
                    >
                    <span class="material-count-display">개</span>
                </div>
            </div>
        `;
    }).join('');

    return `<div class="material-grid">${materialItems}</div>`;
}

// 재료 개수 관련 함수들
function getMaterialCount(charId, materialIndex) {
    const data = loadCharacterData(charId);
    return (data.materialCounts && data.materialCounts[materialIndex]) || 0;
}

function setMaterialCount(charId, materialIndex, count) {
    const data = loadCharacterData(charId);
    if (!data.materialCounts) {
        data.materialCounts = {};
    }
    
    if (count > 0) {
        data.materialCounts[materialIndex] = count;
    } else {
        delete data.materialCounts[materialIndex];
    }
    
    saveCharacterData(charId, data);
}

// 재료 삭제 시 캐릭터 데이터 업데이트
function updateCharacterDataAfterMaterialDeletion(deletedIndex) {
    const characters = getCharacterList();
    characters.forEach(char => {
        const data = loadCharacterData(char.id);
        
        if (data.materialCounts) {
            const newMaterialCounts = {};
            Object.keys(data.materialCounts).forEach(key => {
                const idx = parseInt(key);
                if (idx < deletedIndex) {
                    newMaterialCounts[idx] = data.materialCounts[key];
                } else if (idx > deletedIndex) {
                    newMaterialCounts[idx - 1] = data.materialCounts[key];
                }
            });
            data.materialCounts = newMaterialCounts;
            saveCharacterData(char.id, data);
        }
    });
}

function createSingleQuestTable(charId, dataArray, dataType, isOverview = false) {
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const typeFilter = document.getElementById('typeFilter')?.value || 'all';
    const locationFilter = document.getElementById('locationFilter')?.value || 'all';

    let questsToShow = dataArray.map((item, originalIndex) => {
        return { item, originalIndex };
    });

    questsToShow = questsToShow.filter(({ item }) => {
        if (typeFilter !== 'all' && item.type !== typeFilter) return false;
        if (dataType === 'quest' && locationFilter !== 'all' && item.location !== locationFilter) return false;
        return true;
    });

    if (statusFilter !== 'all') {
        questsToShow = questsToShow.filter(({ originalIndex }) => {
            const isCompleted = isChecked(charId, originalIndex, dataType);
            return statusFilter === 'completed' ? isCompleted : !isCompleted;
        });
    }

    if (questsToShow.length === 0) {
        return '<div style="text-align: center; padding: 20px; color: var(--text-secondary);">표시할 항목이 없습니다</div>';
    }

    let headers;
    if (dataType === 'quest') {
        headers = isOverview
            ? '<tr><th>구분</th><th>위치</th><th>NPC명</th><th>필요아이템</th><th>수량</th><th>보상</th><th>완료</th></tr>'
            : '<tr><th>구분</th><th>위치</th><th>NPC명</th><th>필요아이템</th><th>필요수량</th><th>보상아이템</th><th>보상수량</th><th>완료</th></tr>';
    } else {
        headers = '<tr><th>구분</th><th>카테고리</th><th>퀘스트명</th><th>진행도</th><th>완료</th></tr>';
    }

    const rows = questsToShow.map(({ item, originalIndex }) => {
        const badgeClass = item.type === 'weekly' ? 'weekly-badge' :
            item.type === 'accountDaily' ? 'account-daily-badge' :
                item.type === 'accountWeekly' ? 'account-weekly-badge' : 'daily-badge';
        const badgeText = item.type === 'weekly' ? '주간' :
            item.type === 'accountDaily' ? '계정일간' :
                item.type === 'accountWeekly' ? '계정주간' : '일간';
        const rowClass = item.type === 'weekly' ? 'weekly' :
            item.type === 'accountDaily' ? 'account-daily' :
                item.type === 'accountWeekly' ? 'account-weekly' : '';

        if (dataType === 'quest') {
            return isOverview
                ? `<tr class="${rowClass}" data-char="${charId}" data-row="${originalIndex}" data-type="${dataType}">
                    <td><span class="${badgeClass}">${badgeText}</span></td>
                    <td>${item.location}</td>
                    <td>${item.npc}</td>
                    <td>${item.need}</td>
                    <td>${item.needCount}</td>
                    <td>${item.reward} ${item.rewardCount}</td>
                    <td><input type='checkbox' class='checker' data-char="${charId}" data-row="${originalIndex}" data-type="${dataType}"></td>
                   </tr>`
                : `<tr class="${rowClass}" data-char="${charId}" data-row="${originalIndex}" data-type="${dataType}">
                    <td><span class="${badgeClass}">${badgeText}</span></td>
                    <td>${item.location}</td>
                    <td>${item.npc}</td>
                    <td>${item.need}</td>
                    <td>${item.needCount}</td>
                    <td>${item.reward}</td>
                    <td>${item.rewardCount}</td>
                    <td><input type='checkbox' class='checker' data-char="${charId}" data-row="${originalIndex}" data-type="${dataType}"></td>
                   </tr>`;
        } else {
            let progressHtml = '<div style="display: flex; align-items: center; gap: 5px; justify-content: center; flex-wrap: wrap;">';
            for (let i = 0; i < item.count; i++) {
                progressHtml += `<input type="checkbox" class="individual-checker" data-char="${charId}" data-quest="${originalIndex}" data-count="${i}" title="${i + 1}회차" style="transform: scale(1.1); cursor: pointer; margin: 2px;">`;
            }
            const completedCount = getQuestMgmtCompletedCount(charId, originalIndex);
            progressHtml += `<span style="margin-left: 8px; font-size: 12px; color: var(--text-secondary); display:none;">${completedCount}/${item.count}</span>`;
            progressHtml += '</div>';

            return `<tr class="${rowClass}" data-char="${charId}" data-row="${originalIndex}" data-type="${dataType}">
                <td><span class="${badgeClass}">${badgeText}</span></td>
                <td>${item.category}</td>
                <td>${item.name}</td>
                <td>${progressHtml}</td>
                <td><input type='checkbox' class='checker' data-char="${charId}" data-row="${originalIndex}" data-type="${dataType}"></td>
               </tr>`;
        }
    }).join('');

    return `
        <div class="table-container">
            <table>
                <thead>${headers}</thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

// 탭 렌더링
function renderTabs() {
    const tabContainer = document.getElementById('tabContainer');
    const characterTabContainer = document.getElementById('characterTabContainer');
    const characters = getCharacterList();

    let mainTabsHTML = '<button class="tab-btn overview-tab" data-target="#allView">📋 전체 보기</button>';
    mainTabsHTML += '<button class="tab-btn overview-tab" data-target="#tradeManagement">📦 물물교환 관리</button>';
    mainTabsHTML += '<button class="tab-btn overview-tab" data-target="#questManagement">⚔️ 퀘스트 관리</button>';
    mainTabsHTML += '<button class="tab-btn overview-tab" data-target="#materialManagement">🧰 재료 관리</button>';

    tabContainer.innerHTML = mainTabsHTML;

    let characterTabsHTML = '';
    characters.forEach(char => {
        characterTabsHTML += `
                    <button class="tab-btn character-tab" data-target="#char_${char.id}">
                        🎯 ${char.name}
                        <span class="delete-char" onclick="event.stopPropagation(); deleteCharacter('${char.id}')" title="캐릭터 삭제">×</span>
                    </button>
                `;
    });

    characterTabContainer.innerHTML = characterTabsHTML;

    setupTabEvents();
}

// 전체보기 렌더링
function renderAllCharacters() {
    const allView = document.getElementById('allView');
    const characters = getCharacterList();
    const emptyState = document.getElementById('emptyState');

    if (characters.length === 0) {
        emptyState.style.display = 'block';
        const characterBoxes = allView.querySelectorAll('.character-box');
        characterBoxes.forEach(box => box.remove());
        return;
    }

    emptyState.style.display = 'none';

    const characterBoxes = allView.querySelectorAll('.character-box');
    characterBoxes.forEach(box => box.remove());

    const totalTradeQuests = questData.length;
    const totalQuestMgmtCount = questManagementData.reduce((sum, quest) => sum + quest.count, 0);
    const totalQuests = totalTradeQuests + totalQuestMgmtCount;

    cleanupAccountData();

    characters.forEach(char => {
        const characterBox = document.createElement('div');
        const data = cleanupCharacterData(char.id);

        characterBox.className = 'character-box';
        characterBox.innerHTML = `
            <h3>
                🎯 <button class="edit-name" onclick="editCharacterName('${char.id}', '${char.name}')">${char.name}</button>
            </h3>
            <div class="progress-info">
                <div>진행률: <span id="progress-all-${char.id}">0/${totalQuests} (0%)</span></div>
                <div class="progress-bar"><div class="progress-fill" id="bar-all-${char.id}"></div></div>
            </div>
            <div style="margin-bottom: 15px;">
                <textarea class="memo-input" placeholder="캐릭터 메모..." data-char="${char.id}" style="width: 100%; min-height: 60px;">${loadCharacterData(char.id).characterMemo || ''}</textarea>
            </div>
            ${createQuestTable(char.id, true)}
            <button class="btn btn-danger" onclick="resetCharacter('${char.id}')">🔄 초기화</button>
        `;

        allView.appendChild(characterBox);

        let charPage = document.getElementById(`char_${char.id}`);
        if (!charPage) {
            charPage = document.createElement('div');
            charPage.className = 'character';
            charPage.id = `char_${char.id}`;
            document.body.appendChild(charPage);
        }

        charPage.innerHTML = `
            <div class="progress-info">
                <div>${char.name} 진행률: <span id="progress-${char.id}">0/${totalQuests} (0%)</span></div>
                <div class="progress-bar"><div class="progress-fill" id="bar-${char.id}"></div></div>
                <small>💡 주간 퀘스트는 노란색, 일간 퀘스트는 파란색으로 표시됩니다</small>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500; color: var(--text-secondary);">📝 캐릭터 메모</label>
                <textarea class="memo-input" placeholder="이 캐릭터에 대한 메모를 입력하세요..." data-char="${char.id}" style="width: 100%; min-height: 80px;">${loadCharacterData(char.id).characterMemo || ''}</textarea>
            </div>
            ${createQuestTable(char.id, false)}
            <button class="btn btn-danger" onclick="resetCharacter('${char.id}')">🔄 전체 초기화</button>
        `;

        restoreCheckStates(char.id);
        updateProgress(char.id);
    });

    setupQuestEvents();
}

// 체크 상태 복원
function restoreCheckStates(charId) {
    // 데이터 무결성 검증 먼저 실행
    validateCharacterData(charId);

    document.querySelectorAll(`tr[data-char='${charId}']`).forEach(row => {
        const rowIndex = parseInt(row.getAttribute('data-row'));
        const dataType = row.getAttribute('data-type') || 'quest';

        if (dataType === 'quest') {
            const totalLength = questData.length;

            if (rowIndex >= 0 && rowIndex < totalLength) {
                const quest = questData[rowIndex];
                
                // 계정 퀘스트인 경우 계정 데이터에서 확인
                if (quest && (quest.type === 'accountDaily' || quest.type === 'accountWeekly')) {
                    const checked = isAccountChecked(rowIndex, dataType);
                    const checkbox = row.querySelector('.checker');
                    if (checkbox) {
                        checkbox.checked = checked;
                        if (checked) row.classList.add('completed');
                    }
                } else {
                    // 일반 퀘스트 처리
                    const checked = isChecked(charId, rowIndex, dataType);
                    const checkbox = row.querySelector('.checker');
                    if (checkbox) {
                        checkbox.checked = checked;
                        if (checked) row.classList.add('completed');
                    }
                }
            }
        } else {
            // questManagement 처리
            const totalLength = questManagementData.length;

            if (rowIndex >= 0 && rowIndex < totalLength) {
                const quest = questManagementData[rowIndex];
                if (quest) {
                    // 계정 퀘스트인 경우
                    if (quest.type === 'accountDaily' || quest.type === 'accountWeekly') {
                        // 개별 체크박스 복원
                        const individualCheckboxes = row.querySelectorAll('.individual-checker');
                        individualCheckboxes.forEach((checkbox, countIndex) => {
                            const checked = isQuestMgmtChecked(charId, rowIndex, countIndex);
                            checkbox.checked = checked;
                        });

                        // 전체 완료 상태 확인
                        const completedCount = getQuestMgmtCompletedCount(charId, rowIndex);
                        const allCompleted = completedCount === quest.count;

                        const mainCheckbox = row.querySelector('.checker');
                        if (mainCheckbox) {
                            mainCheckbox.checked = allCompleted;
                            if (allCompleted) row.classList.add('completed');
                        }

                        const progressSpan = row.querySelector('td:nth-child(4) span');
                        if (progressSpan) {
                            progressSpan.textContent = `${completedCount}/${quest.count}`;
                        }
                    } else {
                        // 일반 캐릭터별 퀘스트
                        const individualCheckboxes = row.querySelectorAll('.individual-checker');
                        individualCheckboxes.forEach((checkbox, countIndex) => {
                            const checked = isQuestMgmtChecked(charId, rowIndex, countIndex);
                            checkbox.checked = checked;
                        });

                        const completedCount = getQuestMgmtCompletedCount(charId, rowIndex);
                        const allCompleted = completedCount === quest.count;

                        const mainCheckbox = row.querySelector('.checker');
                        if (mainCheckbox) {
                            mainCheckbox.checked = allCompleted;
                            if (allCompleted) row.classList.add('completed');
                        }

                        const progressSpan = row.querySelector('td:nth-child(4) span');
                        if (progressSpan) {
                            progressSpan.textContent = `${completedCount}/${quest.count}`;
                        }
                    }
                }
            }
        }
    });
}

let updateTimeout = null;

function debouncedUpdate() {
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }
    
    updateTimeout = setTimeout(() => {
        renderAllCharacters();
        updateFiltersAndUI();
        updateTimeout = null;
    }, 150);
}

// 캐릭터 초기화
function resetCharacter(charId) {
    if (!confirm('정말 이 캐릭터의 모든 진행상황을 초기화하시겠습니까?')) return;

    const data = {
        lastDailyReset: getCurrentLogicDate(),
        lastWeeklyReset: getCurrentWeekStart(),
        dailyChecks: {},
        weeklyChecks: {},
        dailyQuestMgmtChecks: {},
        weeklyQuestMgmtChecks: {},
        characterMemo: ''
    };

    saveCharacterData(charId, data);

    document.querySelectorAll(`tr[data-char='${charId}']`).forEach(row => {
        const checkbox = row.querySelector('.checker');
        if (checkbox) {
            checkbox.checked = false;
            row.classList.remove('completed');
        }

        const individualCheckboxes = row.querySelectorAll('.individual-checker');
        individualCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        const progressSpan = row.querySelector('td:nth-child(4) span');
        if (progressSpan) {
            const dataType = row.getAttribute('data-type');
            const rowIndex = parseInt(row.getAttribute('data-row'));
            if (dataType === 'questManagement' && questManagementData[rowIndex]) {
                const quest = questManagementData[rowIndex];
                progressSpan.textContent = `0/${quest.count}`;
            }
        }
    });

    document.querySelectorAll(`textarea[data-char='${charId}']`).forEach(textarea => {
        textarea.value = '';
    });

    updateProgress(charId);
}

// 캐릭터 데이터 정리
function cleanupCharacterData(charId) {
    const data = loadCharacterData(charId);
    let changed = false;

    const validDailyChecks = {};
    Object.keys(data.dailyChecks || {}).forEach(key => {
        const idx = parseInt(key);
        if (idx >= 0 && idx < questData.length && questData[idx] && 
            questData[idx].type === 'daily') { // 계정 퀘스트는 자동으로 제외됨
            validDailyChecks[idx] = data.dailyChecks[key];
        } else {
            changed = true;
        }
    });

    const validWeeklyChecks = {};
    Object.keys(data.weeklyChecks || {}).forEach(key => {
        const idx = parseInt(key);
        if (idx >= 0 && idx < questData.length && questData[idx] && 
            questData[idx].type === 'weekly') { // 계정 퀘스트는 자동으로 제외됨
            validWeeklyChecks[idx] = data.weeklyChecks[key];
        } else {
            changed = true;
        }
    });

    const validDailyQuestMgmtChecks = {};
    Object.keys(data.dailyQuestMgmtChecks || {}).forEach(key => {
        const idx = parseInt(key);
        if (idx >= 0 && idx < questManagementData.length && questManagementData[idx] && questManagementData[idx].type === 'daily') {
            const quest = questManagementData[idx];
            const checks = data.dailyQuestMgmtChecks[key];
            if (Array.isArray(checks) && checks.length === quest.count) {
                validDailyQuestMgmtChecks[idx] = checks;
            } else {
                validDailyQuestMgmtChecks[idx] = new Array(quest.count).fill(false);
                changed = true;
            }
        } else {
            changed = true;
        }
    });

    const validWeeklyQuestMgmtChecks = {};
    Object.keys(data.weeklyQuestMgmtChecks || {}).forEach(key => {
        const idx = parseInt(key);
        if (idx >= 0 && idx < questManagementData.length && questManagementData[idx] && questManagementData[idx].type === 'weekly') {
            const quest = questManagementData[idx];
            const checks = data.weeklyQuestMgmtChecks[key];
            if (Array.isArray(checks) && checks.length === quest.count) {
                validWeeklyQuestMgmtChecks[idx] = checks;
            } else {
                validWeeklyQuestMgmtChecks[idx] = new Array(quest.count).fill(false);
                changed = true;
            }
        } else {
            changed = true;
        }
    });

    if (changed) {
        data.dailyChecks = validDailyChecks;
        data.weeklyChecks = validWeeklyChecks;
        data.dailyQuestMgmtChecks = validDailyQuestMgmtChecks;
        data.weeklyQuestMgmtChecks = validWeeklyQuestMgmtChecks;
        saveCharacterData(charId, data);
    }

    return data;
}

function cleanupAccountData() {
    // 계정 일간 물물교환 데이터 정리
    const accountDailyTradeKey = 'mabinogi_account_daily_quest';
    const accountDailyTradeData = JSON.parse(localStorage.getItem(accountDailyTradeKey) || '{}');
    const validAccountDailyTrade = {};

    Object.keys(accountDailyTradeData).forEach(key => {
        const idx = parseInt(key);
        if (idx >= 0 && idx < questData.length && questData[idx] && questData[idx].type === 'accountDaily') {
            validAccountDailyTrade[idx] = accountDailyTradeData[key];
        }
    });
    localStorage.setItem(accountDailyTradeKey, JSON.stringify(validAccountDailyTrade));

    // 계정 주간 물물교환 데이터 정리
    const accountWeeklyTradeKey = 'mabinogi_account_weekly_quest';
    const accountWeeklyTradeData = JSON.parse(localStorage.getItem(accountWeeklyTradeKey) || '{}');
    const validAccountWeeklyTrade = {};

    Object.keys(accountWeeklyTradeData).forEach(key => {
        const idx = parseInt(key);
        if (idx >= 0 && idx < questData.length && questData[idx] && questData[idx].type === 'accountWeekly') {
            validAccountWeeklyTrade[idx] = accountWeeklyTradeData[key];
        }
    });
    localStorage.setItem(accountWeeklyTradeKey, JSON.stringify(validAccountWeeklyTrade));

    // 계정 일간 퀘스트 관리 데이터 정리
    const accountDailyQuestKey = 'mabinogi_account_daily_questManagement';
    const accountDailyQuestData = JSON.parse(localStorage.getItem(accountDailyQuestKey) || '{}');
    const validAccountDailyQuest = {};

    Object.keys(accountDailyQuestData).forEach(key => {
        const idx = parseInt(key);
        if (idx >= 0 && idx < questManagementData.length && questManagementData[idx] && questManagementData[idx].type === 'accountDaily') {
            validAccountDailyQuest[idx] = accountDailyQuestData[key];
        }
    });
    localStorage.setItem(accountDailyQuestKey, JSON.stringify(validAccountDailyQuest));

    // 계정 주간 퀘스트 관리 데이터 정리
    const accountWeeklyQuestKey = 'mabinogi_account_weekly_questManagement';
    const accountWeeklyQuestData = JSON.parse(localStorage.getItem(accountWeeklyQuestKey) || '{}');
    const validAccountWeeklyQuest = {};

    Object.keys(accountWeeklyQuestData).forEach(key => {
        const idx = parseInt(key);
        if (idx >= 0 && idx < questManagementData.length && questManagementData[idx] && questManagementData[idx].type === 'accountWeekly') {
            validAccountWeeklyQuest[idx] = accountWeeklyQuestData[key];
        }
    });
    localStorage.setItem(accountWeeklyQuestKey, JSON.stringify(validAccountWeeklyQuest));
}

// 탭 관련 함수들
function saveCurrentTab(tabId) {
    localStorage.setItem('mabinogi_currentTab', tabId);
}

function getCurrentTab() {
    return localStorage.getItem('mabinogi_currentTab') || 'allView';
}

function switchToTab(targetId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.character, .all-characters').forEach(content => {
        content.classList.remove('active');
    });

    const targetBtn = document.querySelector(`[data-target="#${targetId}"]`);
    const targetContent = document.getElementById(targetId);

    if (targetBtn) targetBtn.classList.add('active');
    if (targetContent) targetContent.classList.add('active');

    const layoutControls = document.querySelector('.layout-controls');
    if (layoutControls) {
        layoutControls.style.display = targetId === 'allView' ? 'flex' : 'none';
    }

    if (targetId === 'tradeManagement') {
        renderQuestList();
    } else if (targetId === 'questManagement') {
        renderQuestManagementList();
    } else if (targetId === 'materialManagement') {
        renderMaterialList();
    }
}

function setupTabEvents() {
    document.querySelectorAll('#tabContainer .tab-btn').forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target').substring(1);
            switchToTab(targetId);
            saveCurrentTab(targetId);
        });
    });

    document.querySelectorAll('#characterTabContainer .tab-btn').forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target').substring(1);
            switchToTab(targetId);
            saveCurrentTab(targetId);
        });
    });
}

// 이벤트 핸들러들
function setupQuestEvents() {
    document.removeEventListener('click', questClickHandler);
    document.removeEventListener('change', questChangeHandler);
    document.removeEventListener('input', characterMemoInputHandler);

    document.addEventListener('click', questClickHandler);
    document.addEventListener('change', questChangeHandler);
    document.addEventListener('input', characterMemoInputHandler);

    document.addEventListener('input', materialInputHandler);
}

function materialInputHandler(e) {
    if (e.target.classList.contains('material-count-input')) {
        const charId = e.target.getAttribute('data-char');
        const materialIndex = parseInt(e.target.getAttribute('data-material'));
        const count = parseInt(e.target.value) || 0;
        
        clearTimeout(e.target.saveTimer);
        e.target.saveTimer = setTimeout(() => {
            setMaterialCount(charId, materialIndex, count);
        }, 500);
    }
}

function questClickHandler(e) {
    const row = e.target.closest('tr[data-char]');
    if (!row) return;

    if (e.target.type === 'checkbox' || e.target.classList.contains('memo-input')) return;

    const charId = row.getAttribute('data-char');
    const rowIndex = parseInt(row.getAttribute('data-row'));
    const dataType = row.getAttribute('data-type') || 'quest';
    const checkbox = row.querySelector('.checker');

    if (!checkbox) return;

    const newState = !checkbox.checked;
    toggleQuestState(charId, rowIndex, newState, dataType);
}

function questChangeHandler(e) {
    if (e.target.classList.contains('checker')) {
        const charId = e.target.getAttribute('data-char');
        const rowIndex = parseInt(e.target.getAttribute('data-row'));
        const dataType = e.target.getAttribute('data-type') || 'quest';
        const newState = e.target.checked;

        toggleQuestState(charId, rowIndex, newState, dataType);
    } else if (e.target.classList.contains('individual-checker')) {
        const charId = e.target.getAttribute('data-char');
        const questIndex = parseInt(e.target.getAttribute('data-quest'));
        const countIndex = parseInt(e.target.getAttribute('data-count'));
        const checked = e.target.checked;

        setQuestMgmtChecked(charId, questIndex, countIndex, checked);

        const quest = questManagementData[questIndex];
        if (quest) {
            const completedCount = getQuestMgmtCompletedCount(charId, questIndex);
            const allCompleted = completedCount === quest.count;

            const row = e.target.closest('tr');
            const mainCheckbox = row.querySelector('.checker');
            if (mainCheckbox) {
                mainCheckbox.checked = allCompleted;
                row.classList.toggle('completed', allCompleted);
            }

            const progressSpan = row.querySelector('td:nth-child(4) span');
            if (progressSpan) {
                progressSpan.textContent = `${completedCount}/${quest.count}`;
            }
        }

        updateProgress(charId);
        
        // 필터가 적용된 상태라면 테이블을 다시 렌더링
        const currentTab = getCurrentTab();
        if (currentTab === 'allView') {
            const statusFilter = document.getElementById('statusFilter')?.value;
            if (statusFilter && statusFilter !== 'all') {
                setTimeout(() => {
                    renderAllCharacters();
                }, 0);
            }
        }
    }
}

function characterMemoInputHandler(e) {
    if (e.target.classList.contains('memo-input') && e.target.hasAttribute('data-char')) {
        const charId = e.target.getAttribute('data-char');
        const memo = e.target.value;

        clearTimeout(e.target.saveTimer);
        e.target.saveTimer = setTimeout(() => {
            saveCharacterMemo(charId, memo);
        }, 1000);
    }
}

function toggleQuestState(charId, rowIndex, newState, dataType) {
    document.querySelectorAll(`tr[data-char='${charId}'][data-row='${rowIndex}'][data-type='${dataType}']`).forEach(targetRow => {
        const targetCheckbox = targetRow.querySelector('.checker');
        if (targetCheckbox) {
            targetCheckbox.checked = newState;
            targetRow.classList.toggle('completed', newState);
        }

        if (dataType === 'questManagement') {
            const individualCheckboxes = targetRow.querySelectorAll('.individual-checker');
            individualCheckboxes.forEach(checkbox => {
                checkbox.checked = newState;
            });

            const quest = questManagementData[rowIndex];
            if (quest) {
                const progressSpan = targetRow.querySelector('td:nth-child(4) span');
                if (progressSpan) {
                    const count = newState ? quest.count : 0;
                    progressSpan.textContent = `${count}/${quest.count}`;
                }
            }
        }
    });

    setChecked(charId, rowIndex, newState, dataType);
    updateProgress(charId);
    
    // 필터가 적용된 상태라면 테이블을 다시 렌더링
    const currentTab = getCurrentTab();
    if (currentTab === 'allView') {
        const statusFilter = document.getElementById('statusFilter')?.value;
        if (statusFilter && statusFilter !== 'all') {
            setTimeout(() => {
                renderAllCharacters();
            }, 0);
        }
    }
}

// 브라우저 알림 권한 요청
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function showNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification('마비노기 퀘스트 알림', {
            body: message,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎮</text></svg>'
        });
    }
}

// 레이아웃 변경 함수
function changeLayout(columns) {
    const allView = document.getElementById('allView');

    allView.classList.remove('layout-1', 'layout-2', 'layout-3', 'layout-4');
    allView.classList.add(`layout-${columns}`);

    document.querySelectorAll('.layout-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    event.target.classList.add('active');
    localStorage.setItem('mabinogi_layout', columns);
}

// 레이아웃 설정 로드
function loadLayoutSetting() {
    const savedLayout = localStorage.getItem('mabinogi_layout') || '2';
    const layoutNumber = parseInt(savedLayout);

    const allView = document.getElementById('allView');
    allView.classList.remove('layout-1', 'layout-2', 'layout-3', 'layout-4');
    allView.classList.add(`layout-${layoutNumber}`);

    document.querySelectorAll('.layout-btn').forEach((btn, index) => {
        btn.classList.remove('active');
        if (index + 1 === layoutNumber) {
            btn.classList.add('active');
        }
    });
}

// 테마 관련 함수들
function getTheme() {
    return localStorage.getItem('mabinogi_theme') || 'light';
}

function setTheme(theme) {
    localStorage.setItem('mabinogi_theme', theme);
    applyTheme(theme);
}

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getEffectiveTheme(theme) {
    if (theme === 'auto') {
        return getSystemTheme();
    }
    return theme;
}

function applyTheme(theme) {
    const html = document.documentElement;

    html.classList.add('theme-transitioning');

    requestAnimationFrame(() => {
        const effectiveTheme = getEffectiveTheme(theme);

        if (effectiveTheme === 'dark') {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }

        updateThemeIcon(theme);

        setTimeout(() => {
            html.classList.remove('theme-transitioning');
        }, 300);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (!icon) return;

    switch (theme) {
        case 'light':
            icon.textContent = '☀️';
            icon.parentElement.title = '라이트모드 (클릭: 다크모드로)';
            break;
        case 'dark':
            icon.textContent = '🌙';
            icon.parentElement.title = '다크모드 (클릭: 자동모드로)';
            break;
        case 'auto':
            const systemTheme = getSystemTheme();
            icon.textContent = '🔄';
            icon.parentElement.title = `자동모드 (현재: ${systemTheme === 'dark' ? '다크' : '라이트'}) (클릭: 라이트모드로)`;
            break;
        default:
            icon.textContent = '☀️';
            icon.parentElement.title = '라이트모드 (클릭: 다크모드로)';
    }
}

// 3단계 테마 토글: light → dark → auto → light
function toggleTheme() {
    const button = document.querySelector('.theme-toggle');
    if (!button || button.disabled) return;

    button.disabled = true;

    const currentTheme = getTheme();
    let newTheme;

    switch (currentTheme) {
        case 'light':
            newTheme = 'dark';
            break;
        case 'dark':
            newTheme = 'auto';
            break;
        case 'auto':
        default:
            newTheme = 'light';
            break;
    }

    console.log(`테마 전환: ${currentTheme} → ${newTheme}`);
    setTheme(newTheme);

    setTimeout(() => {
        button.disabled = false;
    }, 150);
}

// 시스템 테마 변경 감지 및 처리
function initializeThemeSystem() {
    // 시스템 테마 변경 감지 (auto 모드일 때만 반응)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const currentTheme = getTheme();
        if (currentTheme === 'auto') {
            console.log('시스템 테마 변경 감지, auto 모드 업데이트');
            applyTheme('auto');
        }
    });

    // 초기 테마 적용
    const savedTheme = getTheme();
    console.log('저장된 테마:', savedTheme);
    applyTheme(savedTheme);
}

// 초기화 함수
document.addEventListener('DOMContentLoaded', function () {
    console.log('페이지 로드 시작');

    //requestNotificationPermission();
    checkAccountDataReset();

    initializeThemeSystem();

    loadQuestData();
    loadQuestManagementData();
    loadMaterialData();
    initializeFilters();

    const characters = getCharacterList();
    if (characters.length === 0) {
        const defaultChar = {
            id: generateCharacterId(),
            name: '캐릭터1'
        };
        saveCharacterList([defaultChar]);
        console.log('기본 캐릭터 생성:', defaultChar);
    }
    validateAllCharacterData();

    renderTabs();
    renderAllCharacters();
    updateStats();

    const currentTab = getCurrentTab();
    switchToTab(currentTab);

    const nameInput = document.getElementById('newCharName');
    nameInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addCharacter();
        }
    });

    addAccountResetButton();
    updateResetTimers();
    setInterval(updateResetTimers, 1000);
    loadLayoutSetting();

    console.log('초기화 완료');
});

// 개선된 HTML2Canvas 스크린샷 (CSS 깨짐 최소화)
async function takeScreenshot() {
    const screenshotBtn = document.getElementById('screenshotBtn');
    
    try {
        screenshotBtn.disabled = true;
        screenshotBtn.innerHTML = '📸 처리중...';
        
        // 스크롤을 맨 위로
        window.scrollTo(0, 0);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // CSS 변수들을 직접 읽어서 고정값으로 변환
        const computedStyle = getComputedStyle(document.documentElement);
        const isDark = document.documentElement.hasAttribute('data-theme');
        
        const options = {
            allowTaint: true,
            useCORS: true,
            scale: 1,
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            width: window.innerWidth,
            height: Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            ),
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: 0,
            foreignObjectRendering: true,
            removeContainer: true,
            logging: false,
            onclone: (clonedDoc) => {
                // 클론된 문서에서 CSS 변수를 고정값으로 교체
                const clonedRoot = clonedDoc.documentElement;
                
                // 모든 스타일시트에서 CSS 변수 사용하는 부분을 고정값으로 교체
                const allElements = clonedDoc.querySelectorAll('*');
                allElements.forEach(element => {
                    const style = element.style;
                    
                    // CSS 변수를 사용하는 속성들을 고정값으로 교체
                    if (style.color && style.color.includes('var(')) {
                        style.color = isDark ? '#f9fafb' : '#1f2937';
                    }
                    if (style.backgroundColor && style.backgroundColor.includes('var(')) {
                        style.backgroundColor = isDark ? '#1f2937' : '#ffffff';
                    }
                    if (style.borderColor && style.borderColor.includes('var(')) {
                        style.borderColor = isDark ? '#374151' : '#e5e7eb';
                    }
                });
                
                // 인라인 스타일로 기본 색상 강제 적용
                const styleElement = clonedDoc.createElement('style');
                styleElement.textContent = `
                    * { 
                        color: ${isDark ? '#f9fafb' : '#1f2937'} !important;
                        border-color: ${isDark ? '#374151' : '#e5e7eb'} !important;
                    }
                    body { 
                        background-color: ${isDark ? '#1f2937' : '#ffffff'} !important;
                    }
                    .character-box, .quest-management {
                        background-color: ${isDark ? '#111827' : '#f8fafc'} !important;
                        border: 1px solid ${isDark ? '#374151' : '#e5e7eb'} !important;
                    }
                    table {
                        background-color: ${isDark ? '#111827' : '#ffffff'} !important;
                        border: 1px solid ${isDark ? '#374151' : '#e5e7eb'} !important;
                    }
                    th, td {
                        border-color: ${isDark ? '#374151' : '#e5e7eb'} !important;
                        background-color: ${isDark ? '#1f2937' : '#ffffff'} !important;
                    }
                    .btn {
                        background-color: ${isDark ? '#374151' : '#f3f4f6'} !important;
                        color: ${isDark ? '#f9fafb' : '#1f2937'} !important;
                        border-color: ${isDark ? '#4b5563' : '#d1d5db'} !important;
                    }
                `;
                clonedDoc.head.appendChild(styleElement);
            }
        };

        const canvas = await html2canvas(document.body, options);
        downloadScreenshot(canvas);
        showSaveStatus();
        
    } catch (error) {
        console.error('스크린샷 생성 실패:', error);
        alert('스크린샷 생성에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요.');
        showSaveStatus(true);
    } finally {
        screenshotBtn.disabled = false;
        screenshotBtn.innerHTML = '📸 스크린샷';
    }
}

// 다운로드 함수
function downloadScreenshot(canvas) {
    try {
        const link = document.createElement('a');
        const currentTime = new Date();
        const timestamp = currentTime.getFullYear() + '-' +
            String(currentTime.getMonth() + 1).padStart(2, '0') + '-' +
            String(currentTime.getDate()).padStart(2, '0') + '_' +
            String(currentTime.getHours()).padStart(2, '0') + '-' +
            String(currentTime.getMinutes()).padStart(2, '0') + '-' +
            String(currentTime.getSeconds()).padStart(2, '0');
        
        link.download = `마비노기_체크리스트_${timestamp}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('다운로드 실패:', error);
        alert('이미지 다운로드에 실패했습니다.');
    }
}