import React, { useState } from 'react';
import Papa from 'papaparse';
import './App.css';

interface UserData {
  user_id: string;
  update_count: number;
  e164?: string;
  deleted?: boolean;
}

interface ComparisonResult {
  user_id: string;
  yesterday_count: number;
  today_count: number;
  difference: number;
  e164?: string;
  country?: string;
  deleted?: boolean;
}

interface Statistics {
  yesterday_stats: { [key: number]: number };
  today_stats: { [key: number]: number };
  filtered_users: ComparisonResult[];
}

function App() {
  const [yesterdayFile, setYesterdayFile] = useState<File | null>(null);
  const [todayFile, setTodayFile] = useState<File | null>(null);
  const [result, setResult] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);

  // E164 번호로부터 국가 판별
  const getCountryFromE164 = (e164: string): string => {
    if (!e164) return '';
    const cleanNumber = e164.replace(/[^\d+]/g, '');
    if (cleanNumber.startsWith('+1')) return '미국';
    if (cleanNumber.startsWith('+82')) return '한국';
    return '기타';
  };

  const parseCSV = (file: File): Promise<UserData[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log('CSV 파싱 결과:', results);
          const data = results.data as any[];
          console.log('원본 데이터:', data);
          
          // 가능한 컬럼명들 확인
          const headers = Object.keys(data[0] || {});
          console.log('CSV 헤더들:', headers);
          
          // user_id 컬럼 찾기 (다양한 패턴 지원)
          const userIdColumn = headers.find(h => 
            h.toLowerCase().includes('user') && h.toLowerCase().includes('id')
          ) || headers.find(h => h.toLowerCase().includes('user')) 
          || headers.find(h => h.toLowerCase().includes('id'))
          || 'user_id';
          
          // 사용횟수/update_count 컬럼 찾기 (다양한 패턴 지원)
          const updateCountColumn = headers.find(h => 
            h.includes('사용횟수')
          ) || headers.find(h => 
            h.toLowerCase().includes('update') && h.toLowerCase().includes('count')
          ) || headers.find(h => 
            h.toLowerCase().includes('count')
          ) || headers.find(h => 
            h.toLowerCase().includes('usage')
          ) || headers.find(h => 
            h.toLowerCase().includes('횟수')
          ) || 'update_count';
          
          // E164 컬럼 찾기
          const e164Column = headers.find(h => 
            h.toLowerCase().includes('e164')
          ) || headers.find(h => 
            h.toLowerCase().includes('phone')
          ) || headers.find(h => 
            h.toLowerCase().includes('전화')
          ) || 'e164';
          
          // 삭제여부 컬럼 찾기
          const deletedColumn = headers.find(h => 
            h.toLowerCase().includes('삭제')
          ) || headers.find(h => 
            h.toLowerCase().includes('deleted')
          ) || headers.find(h => 
            h.toLowerCase().includes('delete')
          ) || headers.find(h => 
            h.toLowerCase().includes('remove')
          ) || 'deleted';
          
          console.log('사용할 컬럼명:', { userIdColumn, updateCountColumn, e164Column, deletedColumn });
          console.log('첫 번째 행 데이터:', data[0]);
          console.log('첫 번째 행의 user_id 값:', data[0]?.[userIdColumn]);
          console.log('첫 번째 행의 사용횟수 값:', data[0]?.[updateCountColumn]);
          console.log('첫 번째 행의 E164 값:', data[0]?.[e164Column]);
          console.log('첫 번째 행의 삭제여부 값:', data[0]?.[deletedColumn]);
          
          const parsedData = data
            .filter(row => {
              const userId = row[userIdColumn];
              const updateCount = row[updateCountColumn];
              const hasUserId = userId && userId.toString().trim() !== '';
              const hasUpdateCount = updateCount !== undefined && updateCount !== null && updateCount.toString().trim() !== '';
              console.log('행 필터링:', { row, userId, updateCount, hasUserId, hasUpdateCount });
              return hasUserId && hasUpdateCount;
            })
            .map(row => {
              const deletedValue = row[deletedColumn];
              const isDeleted = deletedValue && (
                deletedValue.toString().toLowerCase().includes('true') ||
                deletedValue.toString().toLowerCase().includes('1') ||
                deletedValue.toString().toLowerCase().includes('삭제') ||
                deletedValue.toString().toLowerCase().includes('deleted')
              );
              
              const userData = {
                user_id: row[userIdColumn].toString().trim(),
                update_count: parseInt(row[updateCountColumn].toString()) || 0,
                e164: row[e164Column] ? row[e164Column].toString().trim() : undefined,
                deleted: isDeleted
              };
              console.log('파싱된 유저 데이터:', userData);
              return userData;
            });
          
          console.log('최종 파싱된 데이터:', parsedData);
          resolve(parsedData);
        },
        error: (error) => {
          console.error('CSV 파싱 오류:', error);
          reject(error);
        }
      });
    });
  };

  const compareData = async () => {
    if (!yesterdayFile || !todayFile) {
      alert('어제와 오늘의 CSV 파일을 모두 업로드해주세요.');
      return;
    }

    setLoading(true);
    try {
      console.log('비교 시작...');
      const [yesterdayData, todayData] = await Promise.all([
        parseCSV(yesterdayFile),
        parseCSV(todayFile)
      ]);

      console.log('어제 데이터:', yesterdayData);
      console.log('오늘 데이터:', todayData);

      // 어제 데이터를 Map으로 변환
      const yesterdayMap = new Map<string, number>();
      yesterdayData.forEach(user => {
        yesterdayMap.set(user.user_id, user.update_count);
      });

      console.log('어제 데이터 Map:', yesterdayMap);

      // 통계 계산
      const yesterdayStats: { [key: number]: number } = {};
      const todayStats: { [key: number]: number } = {};

      yesterdayData.forEach(user => {
        const count = user.update_count;
        yesterdayStats[count] = (yesterdayStats[count] || 0) + 1;
      });

      todayData.forEach(user => {
        const count = user.update_count;
        todayStats[count] = (todayStats[count] || 0) + 1;
      });

      console.log('어제 통계:', yesterdayStats);
      console.log('오늘 통계:', todayStats);

      // 비교 결과 생성
      const filteredUsers: ComparisonResult[] = [];
      
      todayData.forEach(user => {
        const yesterdayCount = yesterdayMap.get(user.user_id) || 0;
        const difference = user.update_count - yesterdayCount;
        
        console.log(`유저 ${user.user_id}: 어제 ${yesterdayCount}회, 오늘 ${user.update_count}회, 차이 ${difference}회`);
        
        // 조건: (어제 0-2회 또는 신규 유저) AND 오늘 3회 이상 AND 삭제되지 않음
        const isNewUser = yesterdayCount === 0; // 어제 파일에 없던 신규 유저
        const wasLowUsage = yesterdayCount > 0 && yesterdayCount <= 2; // 어제 1-2회였던 유저
        const isHighUsageToday = user.update_count >= 3; // 오늘 3회 이상
        const isNotDeleted = !user.deleted; // 삭제되지 않음
        
        if ((isNewUser || wasLowUsage) && isHighUsageToday && isNotDeleted) {
          const userType = isNewUser ? '신규 유저' : '기존 유저';
          console.log(`필터링됨: ${user.user_id} (${userType}, 삭제되지 않음)`);
          filteredUsers.push({
            user_id: user.user_id,
            yesterday_count: yesterdayCount,
            today_count: user.update_count,
            difference: difference,
            e164: user.e164,
            country: getCountryFromE164(user.e164 || ''),
            deleted: user.deleted
          });
        } else if (user.deleted) {
          console.log(`제외됨: ${user.user_id} (삭제된 유저)`);
        } else if (!isHighUsageToday) {
          console.log(`제외됨: ${user.user_id} (오늘 3회 미만: ${user.update_count}회)`);
        }
      });

      console.log('필터링된 유저들:', filteredUsers);
      console.log('최종 결과:', {
        yesterday_stats: yesterdayStats,
        today_stats: todayStats,
        filtered_users: filteredUsers
      });

      setResult({
        yesterday_stats: yesterdayStats,
        today_stats: todayStats,
        filtered_users: filteredUsers
      });
    } catch (error) {
      console.error('비교 중 오류:', error);
      alert('파일 처리 중 오류가 발생했습니다: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;

    const csvData = [
      ['user_id', 'e164', 'country', 'yesterday_count', 'today_count', 'difference', 'deleted'],
      ...result.filtered_users.map(user => [
        user.user_id,
        user.e164 || '',
        user.country || '',
        user.yesterday_count,
        user.today_count,
        user.difference,
        user.deleted ? '삭제됨' : '활성'
      ])
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'filtered_users.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadStatistics = () => {
    if (!result) return;

    console.log('통계 다운로드 시작:', result);

    // 전체 통계 데이터
    const allCounts = Array.from(new Set([
      ...Object.keys(result.yesterday_stats).map(Number),
      ...Object.keys(result.today_stats).map(Number)
    ])).sort((a, b) => a - b);

    const statsData = [
      ['=== 전체 통계 ==='],
      ['count', 'yesterday_users', 'today_users'],
      ...allCounts.map(count => [
        count,
        result.yesterday_stats[count] || 0,
        result.today_stats[count] || 0
      ]),
      [''],
      ['=== 국가별 통계 (필터링된 유저 기준) ==='],
      ['country', 'count', 'yesterday_users', 'today_users']
    ];

    // 국가별 통계 계산
    const countryStats: { [key: string]: { [key: number]: number } } = {
      '한국': {},
      '미국': {},
      '기타': {}
    };

    // 필터링된 유저들에서 국가별 통계 계산
    result.filtered_users.forEach(user => {
      const country = user.country || '기타';
      const todayCount = user.today_count;
      
      if (countryStats[country]) {
        countryStats[country][todayCount] = (countryStats[country][todayCount] || 0) + 1;
      }
    });

    console.log('국가별 통계:', countryStats);

    // 국가별 통계 데이터 추가
    Object.entries(countryStats).forEach(([country, counts]) => {
      const sortedCounts = Object.keys(counts).map(Number).sort((a, b) => a - b);
      
      if (sortedCounts.length > 0) {
        sortedCounts.forEach(count => {
          statsData.push([
            country,
            count.toString(),
            '0', // 어제는 필터링된 유저이므로 0
            counts[count].toString()
          ]);
        });
      }
    });

    console.log('최종 통계 데이터:', statsData);

    const csv = Papa.unparse(statsData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_statistics.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CSV 유저 비교 도구</h1>
        <p>어제와 오늘의 CSV 파일을 비교하여 업데이트 횟수가 3회 이상인 유저를 찾습니다.</p>
      </header>

      <main className="App-main">
        <div className="upload-section">
          <div className="file-upload">
            <label htmlFor="yesterday-file">
              어제 CSV 파일:
              <input
                id="yesterday-file"
                type="file"
                accept=".csv"
                onChange={(e) => setYesterdayFile(e.target.files?.[0] || null)}
              />
            </label>
            {yesterdayFile && <span className="file-name">{yesterdayFile.name}</span>}
          </div>

          <div className="file-upload">
            <label htmlFor="today-file">
              오늘 CSV 파일:
              <input
                id="today-file"
                type="file"
                accept=".csv"
                onChange={(e) => setTodayFile(e.target.files?.[0] || null)}
              />
            </label>
            {todayFile && <span className="file-name">{todayFile.name}</span>}
          </div>

          <button 
            className="compare-button" 
            onClick={compareData}
            disabled={!yesterdayFile || !todayFile || loading}
          >
            {loading ? '처리 중...' : '비교 시작'}
          </button>
        </div>

        {result && (
          <div className="results-section">
            <h2>결과</h2>
            
            <div className="statistics">
              <h3>횟수별 유저 인원수</h3>
              <div className="stats-grid">
                <div className="stats-column">
                  <h4>어제</h4>
                  {Object.keys(result.yesterday_stats).length > 0 ? (
                    Object.entries(result.yesterday_stats)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([count, users]) => (
                        <div key={count} className="stat-item">
                          {count}회: {users}명
                        </div>
                      ))
                  ) : (
                    <div className="no-data">데이터 없음</div>
                  )}
                </div>
                <div className="stats-column">
                  <h4>오늘</h4>
                  {Object.keys(result.today_stats).length > 0 ? (
                    Object.entries(result.today_stats)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([count, users]) => (
                        <div key={count} className="stat-item">
                          {count}회: {users}명
                        </div>
                      ))
                  ) : (
                    <div className="no-data">데이터 없음</div>
                  )}
                </div>
              </div>
            </div>

            <div className="filtered-results">
              <h3>필터링된 유저 ({result.filtered_users.length}명)</h3>
              <p>신규 유저 또는 어제 0-2회였던 유저 중 오늘 3회 이상인 유저들</p>
              
              {/* 디버깅 정보 */}
              <div style={{ background: '#f8f9fa', padding: '15px', margin: '15px 0', borderRadius: '5px', fontSize: '0.9rem' }}>
                <strong>디버깅 정보:</strong><br/>
                어제 데이터: {Object.keys(result.yesterday_stats).length}개 그룹<br/>
                오늘 데이터: {Object.keys(result.today_stats).length}개 그룹<br/>
                필터링된 유저: {result.filtered_users.length}명<br/>
                <br/>
                <strong>포함 조건:</strong><br/>
                • 신규 유저 (어제 파일에 없고 오늘 3회 이상)<br/>
                • 기존 유저 (어제 0-2회, 오늘 3회 이상)<br/>
                • 삭제된 유저는 자동으로 제외<br/>
                <br/>
                <strong>참고:</strong> CSV 파일에서 "사용횟수", "삭제여부" 컬럼을 자동으로 인식합니다.<br/>
                브라우저 개발자 도구(F12) → Console에서 상세한 파싱 과정을 확인할 수 있습니다.
              </div>
              
              <div className="download-buttons">
                <button onClick={downloadResult} className="download-button">
                  필터링된 유저 CSV 다운로드
                </button>
                <button onClick={downloadStatistics} className="download-button">
                  통계 CSV 다운로드
                </button>
              </div>

              <div className="user-list">
                {result.filtered_users.slice(0, 10).map((user, index) => (
                  <div key={index} className="user-item">
                    <div className="user-info">
                      <span className="user-id">{user.user_id}</span>
                      {user.e164 && <span className="e164">E164: {user.e164}</span>}
                      {user.country && <span className="country">({user.country})</span>}
                      {user.deleted && <span className="deleted-status">삭제됨</span>}
                    </div>
                    <span className="counts">
                      어제: {user.yesterday_count}회 → 오늘: {user.today_count}회 (+{user.difference})
                    </span>
                  </div>
                ))}
                {result.filtered_users.length > 10 && (
                  <p className="more-users">... 및 {result.filtered_users.length - 10}명 더</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
